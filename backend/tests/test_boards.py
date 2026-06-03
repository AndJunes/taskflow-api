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