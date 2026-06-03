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