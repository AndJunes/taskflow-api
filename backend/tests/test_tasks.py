def _make_column(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "Board", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    return board["columns"][0]["id"]


def test_create_task_with_subtasks(client):
    column_id = _make_column(client)
    resp = client.post("/tasks/", json={
        "title": "Build login",
        "description": "OAuth flow",
        "column_id": column_id,
        "subtasks": [{"title": "Design"}, {"title": "Implement"}],
    })
    assert resp.status_code == 201
    data = resp.json()
    assert data["position"] == 0
    assert len(data["subtasks"]) == 2
    assert data["subtasks"][0]["is_completed"] is False


def test_create_task_unknown_column(client):
    resp = client.post("/tasks/", json={"title": "X", "column_id": 999})
    assert resp.status_code == 404


def test_get_task_not_found(client):
    resp = client.get("/tasks/999")
    assert resp.status_code == 404

def test_move_task_between_columns(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"],
        "columns": [{"name": "Todo"}, {"name": "Doing"}],
    }).json()
    todo_id, doing_id = board["columns"][0]["id"], board["columns"][1]["id"]
    task = client.post("/tasks/", json={"title": "T", "column_id": todo_id}).json()

    resp = client.patch(f"/tasks/{task['id']}", json={"column_id": doing_id})
    assert resp.status_code == 200
    assert resp.json()["column_id"] == doing_id
    assert resp.json()["position"] == 0


def test_toggle_subtask(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    col_id = board["columns"][0]["id"]
    task = client.post("/tasks/", json={
        "title": "T", "column_id": col_id, "subtasks": [{"title": "S"}],
    }).json()
    subtask_id = task["subtasks"][0]["id"]

    resp = client.patch(f"/subtasks/{subtask_id}", json={"is_completed": True})
    assert resp.status_code == 200
    assert resp.json()["is_completed"] is True

def test_create_task_rejects_empty_title(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    col_id = board["columns"][0]["id"]
    resp = client.post("/tasks/", json={"title": "", "column_id": col_id})
    assert resp.status_code == 422

def test_update_task_syncs_subtasks(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    col_id = board["columns"][0]["id"]
    task = client.post("/tasks/", json={
        "title": "T", "column_id": col_id, "subtasks": [{"title": "A"}, {"title": "B"}],
    }).json()
    sub_a = task["subtasks"][0]["id"]

    resp = client.put(f"/tasks/{task['id']}", json={
        "title": "T",
        "subtasks": [{"id": sub_a, "title": "A renamed"}, {"title": "C"}],
    })
    assert resp.status_code == 200
    titles = [s["title"] for s in resp.json()["subtasks"]]
    assert titles == ["A renamed", "C"]   


def test_update_task_preserves_subtask_completion(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    col_id = board["columns"][0]["id"]
    task = client.post("/tasks/", json={
        "title": "T", "column_id": col_id, "subtasks": [{"title": "A"}],
    }).json()
    sub_id = task["subtasks"][0]["id"]
    client.patch(f"/subtasks/{sub_id}", json={"is_completed": True})

    resp = client.put(f"/tasks/{task['id']}", json={
        "title": "T", "subtasks": [{"id": sub_id, "title": "A renamed"}],
    })
    assert resp.json()["subtasks"][0]["is_completed"] is True   


def test_update_task_without_subtasks_keeps_them(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    col_id = board["columns"][0]["id"]
    task = client.post("/tasks/", json={
        "title": "T", "column_id": col_id, "subtasks": [{"title": "A"}],
    }).json()

    resp = client.put(f"/tasks/{task['id']}", json={"title": "Renamed"}) 
    assert len(resp.json()["subtasks"]) == 1   