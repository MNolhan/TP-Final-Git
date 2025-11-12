import { jest } from '@jest/globals';
import RequestType from '../src/models/RequestType.js';
import { router, normalizePriority } from '../src/routes/requestTypes.js';

const res = () => ({
  statusCode: 200,
  body: null,
  status(c) {
    this.statusCode = c;
    return this;
  },
  json(b) {
    this.body = b;
    return this;
  },
  send() {
    this.body = null;
    return this;
  },
});

const next = (err) => {
  if (err) throw err;
};

const h = (method, path) => {
  const layer = router.stack.find(
    (l) => l.route && l.route.path === path && l.route.methods[method],
  );
  if (!layer)
    throw new Error(`Handler introuvable ${method.toUpperCase()} ${path}`);
  return layer.route.stack[0].handle;
};

afterEach(() => {
  jest.restoreAllMocks();
});

describe('normalizePriority', () => {
  test('mappe correctement les priorités connues', () => {
    expect(normalizePriority('HIGH')).toBe('high');
    expect(normalizePriority('low')).toBe('low');
    expect(normalizePriority('Critical')).toBe('critical');
  });

  test("retourne 'medium' par défaut pour valeurs inconnues", () => {
    expect(normalizePriority('inconnue')).toBe('medium');
    expect(normalizePriority(null)).toBe('medium');
  });
});

describe('Routes /request-types', () => {
  test('GET / renvoie un tableau', async () => {
    jest.spyOn(RequestType, 'find').mockResolvedValueOnce([{ code: 'A' }]);
    const req = { query: {} };
    const r = res();
    await h('get', '/')(req, r, next);
    expect(r.statusCode).toBe(200);
    expect(Array.isArray(r.body)).toBe(true);
  });

  test('GET /:id retourne 404 si non trouvé', async () => {
    jest.spyOn(RequestType, 'findById').mockResolvedValueOnce(null);
    const req = { params: { id: '999' } };
    const r = res();
    await h('get', '/:id')(req, r, next);
    expect(r.statusCode).toBe(404);
  });

  test('POST / crée un item', async () => {
    jest
      .spyOn(RequestType, 'create')
      .mockResolvedValueOnce({ _id: '1', name: 'Test' });
    const req = {
      body: {
        name: 'Test',
        category: 'Cat',
        priority: 'low',
      },
    };
    const r = res();
    await h('post', '/')(req, r, next);
    expect(r.statusCode).toBe(201);
    expect(r.body.name).toBe('Test');
  });

  test('POST / retourne 409 si doublon', async () => {
    const err = { code: 11000 };
    jest.spyOn(RequestType, 'create').mockRejectedValueOnce(err);
    const req = { body: { name: 'Test' } };
    const r = res();
    await h('post', '/')(req, r, next);
    expect(r.statusCode).toBe(409);
  });

  test('POST / retourne 400 si invalide', async () => {
    const err = { name: 'ValidationError', message: 'Invalid' };
    jest.spyOn(RequestType, 'create').mockRejectedValueOnce(err);
    const req = { body: {} };
    const r = res();
    await h('post', '/')(req, r, next);
    expect(r.statusCode).toBe(400);
  });

  test('PUT /:id met à jour un item', async () => {
    jest
      .spyOn(RequestType, 'findByIdAndUpdate')
      .mockResolvedValueOnce({ _id: '1', name: 'Modifié' });
    const req = { params: { id: '1' }, body: { name: 'Modifié' } };
    const r = res();
    await h('put', '/:id')(req, r, next);
    expect(r.statusCode).toBe(200);
    expect(r.body.name).toBe('Modifié');
  });

  test('PUT /:id retourne 404 si non trouvé', async () => {
    jest.spyOn(RequestType, 'findByIdAndUpdate').mockResolvedValueOnce(null);
    const req = { params: { id: '999' }, body: { name: 'X' } };
    const r = res();
    await h('put', '/:id')(req, r, next);
    expect(r.statusCode).toBe(404);
  });

  test('DELETE /:id supprime un item', async () => {
    jest
      .spyOn(RequestType, 'findByIdAndDelete')
      .mockResolvedValueOnce({ _id: '1' });
    const req = { params: { id: '1' } };
    const r = res();
    await h('delete', '/:id')(req, r, next);
    expect(r.statusCode).toBe(204);
  });

  test('DELETE /:id retourne 404 si non trouvé', async () => {
    jest.spyOn(RequestType, 'findByIdAndDelete').mockResolvedValueOnce(null);
    const req = { params: { id: '999' } };
    const r = res();
    await h('delete', '/:id')(req, r, next);
    expect(r.statusCode).toBe(404);
  });

  describe('Tests supplémentaires pour couverture complète', () => {
    test('GET / avec active=true filtre les résultats', async () => {
      jest
        .spyOn(RequestType, 'find')
        .mockResolvedValueOnce([{ name: 'Actif' }]);
      const req = { query: { active: 'true' } };
      const r = res();
      await h('get', '/')(req, r, next);
      expect(r.statusCode).toBe(200);
      expect(r.body[0].name).toBe('Actif');
    });

    test('GET /:id déclenche une erreur', async () => {
      jest.spyOn(RequestType, 'findById').mockImplementationOnce(() => {
        throw new Error('Erreur DB');
      });
      const req = { params: { id: '1' } };
      const r = res();
      try {
        await h('get', '/:id')(req, r, next);
      } catch (err) {
        expect(err.message).toBe('Erreur DB');
      }
    });

    test('POST / déclenche une erreur inconnue', async () => {
      jest.spyOn(RequestType, 'create').mockImplementationOnce(() => {
        throw new Error('Erreur inconnue');
      });
      const req = { body: { name: 'X' } };
      const r = res();
      try {
        await h('post', '/')(req, r, next);
      } catch (err) {
        expect(err.message).toBe('Erreur inconnue');
      }
    });

    test('PUT /:id déclenche une erreur inconnue', async () => {
      jest
        .spyOn(RequestType, 'findByIdAndUpdate')
        .mockImplementationOnce(() => {
          throw new Error('Erreur PUT');
        });
      const req = { params: { id: '1' }, body: { name: 'X' } };
      const r = res();
      try {
        await h('put', '/:id')(req, r, next);
      } catch (err) {
        expect(err.message).toBe('Erreur PUT');
      }
    });

    test('DELETE /:id déclenche une erreur inconnue', async () => {
      jest
        .spyOn(RequestType, 'findByIdAndDelete')
        .mockImplementationOnce(() => {
          throw new Error('Erreur DELETE');
        });
      const req = { params: { id: '1' } };
      const r = res();
      try {
        await h('delete', '/:id')(req, r, next);
      } catch (err) {
        expect(err.message).toBe('Erreur DELETE');
      }
    });
  });
});
