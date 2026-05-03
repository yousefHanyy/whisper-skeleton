import { Question } from "../models/Question.js";
import { User } from "../models/User.js";

export async function listGlobalFeed(req, res, next) {
  // TODO:
  // Hint: filter status='answered', visibility='public'.
  // Optional ?tag=xxx: first find user ids with that tag (User.find({tags: xxx}).distinct('_id')),
  //   then add recipient: { $in: ids } to the filter. If no users match, return empty page.
  // Populate recipient with: username displayName avatarUrl tags.
  // Sort answeredAt desc. Pagination envelope { data, page, limit, total, totalPages }.
  // See: docs/API.md "GET /api/feed", tester/tests/global-feed.test.js
  try {
    const { tag, page = 1, limit = 20 } = req.query;
    const filter = { status: "answered", visibility: "public" };

    if (tag) {
      const userIds = await User.find({ tags: tag }).distinct("_id");
      filter.recipient = { $in: ids };
    }

    const skip = (Math.max(1, page) - 1) * limit;
    const [data, total] = await Promise.all([
      Question.find(filter)
        .populate("recipient", "username displayName avatarUrl tags")
        .sort({ answeredAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Question.countDocuments(filter),
    ]);

    res.json({
      data,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}
