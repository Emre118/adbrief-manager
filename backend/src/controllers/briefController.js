const { getDb } = require('../db');
const sendError = require('../utils/errorResponse');
const briefService = require('../services/briefService');

async function listBriefs(req, res) {
  try {
    const briefs = await briefService.listBriefs(getDb(), req.user.id, req.query);
    res.status(200).json({ briefs });
  } catch (error) {
    sendError(res, error);
  }
}

async function getBrief(req, res) {
  try {
    const brief = await briefService.getBriefById(getDb(), req.user.id, req.params.id);
    res.status(200).json({ brief });
  } catch (error) {
    sendError(res, error);
  }
}

async function createBrief(req, res) {
  try {
    const brief = await briefService.createBrief(getDb(), req.user.id, req.body);
    res.status(201).json({ brief });
  } catch (error) {
    sendError(res, error);
  }
}

async function updateBrief(req, res) {
  try {
    const brief = await briefService.updateBrief(getDb(), req.user.id, req.params.id, req.body);
    res.status(200).json({ brief });
  } catch (error) {
    sendError(res, error);
  }
}

async function deleteBrief(req, res) {
  try {
    const result = await briefService.deleteBrief(getDb(), req.user.id, req.params.id);
    res.status(200).json(result);
  } catch (error) {
    sendError(res, error);
  }
}

async function getSummary(req, res) {
  try {
    const summary = await briefService.getSummary(getDb(), req.user.id);
    res.status(200).json({ summary });
  } catch (error) {
    sendError(res, error);
  }
}

module.exports = {
  listBriefs,
  getBrief,
  createBrief,
  updateBrief,
  deleteBrief,
  getSummary
};
