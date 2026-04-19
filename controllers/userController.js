import { User } from "../models/User.js";
import { HttpError } from "../middleware/errorHandler.js";

export async function getPublicProfile(req, res, next) {
  // TODO:
  // Hint: User.findOne({ username }). 404 if missing. Exclude email + passwordHash from response.
  // See: docs/API.md "GET /api/users/:username", tester/tests/profile.test.js
  try {
    // ! .select is used for including and excluding content:
    const user = await User.findOne({ username: req.params.username }).select(
      "-email -passwordHash",
    );
    if (!user) {
      throw new HttpError(404, "User not found");
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  // TODO:
  // Hint: whitelist fields a user may update: displayName, bio, avatarUrl, acceptingQuestions, tags.
  // Silently IGNORE username / email even if sent — they are immutable here.
  // Use findByIdAndUpdate with { new: true, runValidators: true }.
  // See: docs/API.md "PATCH /api/users/me", tester/tests/profile.test.js
  try {
    const { displayName, bio, avatarUrl, acceptingQuestions, tags } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { displayName, bio, avatarUrl, acceptingQuestions, tags },
      { new: true, runValidators: true },
    );
    res.json(user);
  } catch (err) {
    next(err);
  }
}
