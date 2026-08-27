def register_and_login(client, email):
    password = "password123"

    client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": password,
        },
    )

    response = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": password,
        },
    )

    return response.json()["access_token"]



def test_create_application(client):
    token = register_and_login(client, "user1@example.com")

    response = client.post(
        "/api/applications/",
        headers={
            "Authorization": f"Bearer {token}",
        },
        json={
            "company": "Google",
            "role": "Software Engineer",
            "status": "Applied",
            "location": "London",
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["company"] == "Google"
    assert data["role"] == "Software Engineer"
    assert "id" in data
    
    
def test_user_cannot_access_another_users_application(client):
    user1_token = register_and_login(
        client,
        "user1@example.com",
    )

    user2_token = register_and_login(
        client,
        "user2@example.com",
    )

    create_response = client.post(
        "/api/applications/",
        headers={
            "Authorization": f"Bearer {user1_token}",
        },
        json={
            "company": "Google",
            "role": "Software Engineer",
            "status": "Applied",
        },
    )

    application_id = create_response.json()["id"]

    response = client.get(
        f"/api/applications/{application_id}",
        headers={
            "Authorization": f"Bearer {user2_token}",
        },
    )

    assert response.status_code == 404
    


def test_unauthenticated_user_cannot_access_applications(client):
    response = client.get("/api/applications/")

    assert response.status_code in (401, 403)
    

def test_user_cannot_update_another_users_application(client):
    user1_token = register_and_login(client, "owner@example.com")
    user2_token = register_and_login(client, "other@example.com")

    create_response = client.post(
        "/api/applications/",
        headers={"Authorization": f"Bearer {user1_token}"},
        json={
            "company": "Google",
            "role": "Software Engineer",
            "status": "Applied",
        },
    )

    application_id = create_response.json()["id"]

    response = client.patch(
        f"/api/applications/{application_id}",
        headers={"Authorization": f"Bearer {user2_token}"},
        json={"status": "Interview"},
    )

    assert response.status_code == 404



def test_invalid_application_status_returns_422(client):
    token = register_and_login(client, "user@example.com")

    response = client.post(
        "/api/applications/",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "company": "Google",
            "role": "Software Engineer",
            "status": "Waiting",
        },
    )

    assert response.status_code == 422