import request from "supertest";
import app from "../src/server.js";
import RequestType from "../src/models/RequestType.js";

describe("RequestType API – Tests d’intégration", () => {
  beforeEach(async () => {
    await RequestType.deleteMany({});
  });

  test("GET /api/request-types -> retourne un tableau vide", async () => {
    const res = await request(app).get("/api/request-types");
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(0);
  });

  test("POST /api/request-types -> crée un type", async () => {
    const payload = {
      code: "TECH_INT",
      name: "Problème technique INT",
      description: "Test intégration",
      category: "Support",
      priority: "high",
      estimatedResponseTime: 2,
      isActive: true
    };

    const res = await request(app)
      .post("/api/request-types")
      .send(payload);

    expect(res.status).toBe(201);
    expect(res.body.code).toBe(payload.code);
  });

  test("GET /api/request-types/:id -> retourne un type existant", async () => {
    const doc = await RequestType.create({
      code: "BILL_INT",
      name: "Facturation INT",
      description: "Erreur facture",
      category: "Facturation",
      priority: "medium",
      estimatedResponseTime: 12,
      isActive: true
    });

    const res = await request(app).get(`/api/request-types/${doc._id}`);

    expect(res.status).toBe(200);
    expect(res.body._id).toBe(doc._id.toString());
  });

  test("PUT /api/request-types/:id -> met à jour un type", async () => {
    const doc = await RequestType.create({
      code: "CHANGE_INT",
      name: "Changement INT",
      description: "config",
      category: "Update",
      priority: "low",
      estimatedResponseTime: 24,
      isActive: true
    });

    const res = await request(app)
      .put(`/api/request-types/${doc._id}`)
      .send({
        description: "Updated",
        priority: "critical",
        isActive: false
      });

    expect(res.status).toBe(200);
    expect(res.body.description).toBe("Updated");
    expect(res.body.priority).toBe("critical");
    expect(res.body.isActive).toBe(false);
  });

  test("DELETE /api/request-types/:id -> supprime un type", async () => {
    const doc = await RequestType.create({
      code: "DEL_INT",
      name: "À supprimer INT",
      description: "Suppression",
      category: "Test",
      priority: "medium",
      estimatedResponseTime: 1,
      isActive: true
    });

    const res = await request(app).delete(`/api/request-types/${doc._id}`);

    expect(res.status).toBe(204);

    const stillThere = await RequestType.findById(doc._id);
    expect(stillThere).toBeNull();
  });

  test("GET /api/health -> ok", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
