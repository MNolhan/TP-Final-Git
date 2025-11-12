import express from 'express';
import RequestType, { PRIORITIES } from '../models/RequestType.js';

export function normalizePriority(p) {
  const map = {
    low: 'low',
    medium: 'medium',
    high: 'high',
    critical: 'critical',
  };
  return map[String(p ?? '').toLowerCase()] || 'medium';
}

export const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const { active } = req.query;
    const filter = {};
    if (active === 'true') filter.isActive = true;
    if (active === 'false') filter.isActive = false;

    const items = await RequestType.find(filter);
    res.json(items);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const item = await RequestType.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'RequestType not found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { code, name, description, priority, category } = req.body;
    const doc = await RequestType.create({
      code,
      name,
      description: description ?? '',
      priority: normalizePriority(priority),
      category,
    });
    res.status(201).json(doc);
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ error: 'name must be unique' });
    if (err?.name === 'ValidationError')
      return res.status(400).json({ error: err.message });
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, description, priority, isActive } = req.body;
    const update = {};
    if (name !== undefined) update.name = name;
    if (description !== undefined) update.description = description;
    if (priority !== undefined) update.priority = normalizePriority(priority);
    if (isActive !== undefined) update.isActive = !!isActive;

    const doc = await RequestType.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true,
    });

    if (!doc) return res.status(404).json({ error: 'RequestType not found' });
    res.json(doc);
  } catch (err) {
    if (err?.code === 11000)
      return res.status(409).json({ error: 'name must be unique' });
    if (err?.name === 'ValidationError')
      return res.status(400).json({ error: err.message });
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const doc = await RequestType.findByIdAndDelete(req.params.id); // ⬅️ .lean() retiré
    if (!doc) return res.status(404).json({ error: 'RequestType not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export { PRIORITIES };
export default router;
