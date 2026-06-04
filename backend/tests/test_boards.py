def test_create_board(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    resp = client.post("/boards/", json={"name": "Platform Launch", "owner_id": user["id"]})
    assert resp.status_code == 201
    data = resp.json()
    assert data["name"] == "Platform Launch"
    assert data["owner_id"] == user["id"]


def test_get_board(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    created = client.post("/boards/", json={"name": "Roadmap", "owner_id": user["id"]}).json()
    resp = client.get(f"/boards/{created['id']}")
    assert resp.status_code == 200
    assert resp.json()["name"] == "Roadmap"


def test_get_board_not_found(client):
    resp = client.get("/boards/999")
    assert resp.status_code == 404


def test_create_board_unknown_owner(client):
    resp = client.post("/boards/", json={"name": "Ghost", "owner_id": 999})
    assert resp.status_code == 404
    
def test_create_board_with_columns(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    resp = client.post("/boards/", json={
        "name": "Platform Launch",
        "owner_id": user["id"],
        "columns": [{"name": "Todo"}, {"name": "Doing"}, {"name": "Done"}],
    })
    assert resp.status_code == 201
    data = resp.json()
    assert len(data["columns"]) == 3
    assert data["columns"][0]["name"] == "Todo"
    assert data["columns"][0]["position"] == 0

def test_board_detail_includes_nested_tasks(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "Board", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    column_id = board["columns"][0]["id"]
    client.post("/tasks/", json={
        "title": "Build login", "column_id": column_id,
        "subtasks": [{"title": "Design"}],
    })
    resp = client.get(f"/boards/{board['id']}")
    assert resp.status_code == 200
    data = resp.json()
    assert len(data["columns"][0]["tasks"]) == 1
    assert data["columns"][0]["tasks"][0]["title"] == "Build login"
    assert len(data["columns"][0]["tasks"][0]["subtasks"]) == 1

def test_update_board_syncs_columns(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"],
        "columns": [{"name": "Todo"}, {"name": "Doing"}],
    }).json()
    todo_id = board["columns"][0]["id"]
    resp = client.put(f"/boards/{board['id']}", json={
        "name": "B",
        "columns": [{"id": todo_id, "name": "Backlog"}, {"name": "Done"}],
    })
    assert resp.status_code == 200
    names = [c["name"] for c in resp.json()["columns"]]
    assert names == ["Backlog", "Done"]


def test_update_board_name_only_keeps_columns(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={
        "name": "B", "owner_id": user["id"], "columns": [{"name": "Todo"}],
    }).json()
    resp = client.put(f"/boards/{board['id']}", json={"name": "Renamed"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Renamed"
    assert len(resp.json()["columns"]) == 1

def test_delete_board(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    board = client.post("/boards/", json={"name": "B", "owner_id": user["id"]}).json()
    assert client.delete(f"/boards/{board['id']}").status_code == 204
    assert client.get(f"/boards/{board['id']}").status_code == 404   

def test_create_board_rejects_empty_name(client):
    user = client.post("/users/", json={"name": "Ana", "email": "ana@test.com"}).json()
    resp = client.post("/boards/", json={"name": "", "owner_id": user["id"]})
    assert resp.status_code == 422

def test_create_board_without_owner_uses_default(client):
    resp = client.post("/boards/", json={"name": "B", "columns": []})
    assert resp.status_code == 201
    assert resp.json()["owner_id"] is not None      


def test_create_board_with_unknown_owner_still_404(client):
    resp = client.post("/boards/", json={"name": "B", "owner_id": 999})
    assert resp.status_code == 404                   