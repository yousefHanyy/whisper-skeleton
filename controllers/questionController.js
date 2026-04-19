import { Question } from "../models/Question.js";
import { User } from "../models/User.js";
import { HttpError } from "../middleware/errorHandler.js";

// ! NOTE TO SELF:
// ! USING TRY CATCH IN EXPORTED FUNCTIONS IS IMPORTANT SO THAT THE SERVER DOESN'T HANG WAITING.
// ! WHILE HELPER FUNCTIONS DON'T NEED TO CATCH THE ERROR, THEY WOULD RATHER THROW THE ERROR FOR THE CONTROLLER TO CATCH IT AND THE CONTROLLER WILL THEN PASS IT AS A PARAM TO THE NEXT FUNCTION 'NEXT(ERR)' SO THAT THE GLOBAL ERROR HANDLER WOULD THEN DEAL WITH IT.

export async function sendQuestion(req, res, next) {
  // TODO:
  // Hint: find recipient by :username. 404 if missing, 403 if acceptingQuestions === false.
  // Create Question { recipient: recipient._id, body }. Respond 201 WITHOUT recipient field
  // (anonymous send — do not leak sender OR recipient id in the echo).
  // See: docs/API.md "POST /api/users/:username/questions", tester/tests/send-question.test.js
  try {
    const { username } = req.params;
    const { body } = req.body;

    // * Checking if the user asked even exists in the first place, and checking if they allow questions or not:
    const recipient = await User.findOne({ username });
    if (!recipient) {
      throw new HttpError(404, "User not found");
    }
    if (!recipient.acceptingQuestions) {
      throw new HttpError(403, "This user is not accepting questions");
    }

    // * Creating the quesiton:
    const question = await Question.create({
      recipient: recipient._id,
      body,
    });

    // * Responding:
    res.status(201).json({
      id: question.id,
      body: question.body,
      status: question.status,
      createdAt: question.createdAt,
    });
  } catch (err) {
    next(err);
  }
}

export async function listInbox(req, res, next) {
  // TODO:
  // Hint: filter { recipient: req.user._id }. Optional ?status=pending|answered|ignored (else 400).
  // Pagination: page (default 1, min 1), limit (default 20, min 1, max 50).
  // Sort createdAt desc. Envelope: { data, page, limit, total, totalPages }.
  // See: docs/API.md "GET /api/questions/inbox", tester/tests/inbox.test.js
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filter = { recipient: req.user._id };
    // checking status:
    if (status) {
      if (!["pending", "answered", "ignored"].includes(status)) {
        throw new HttpError(404, "Invalid status filter");
      }
      filter.status = status;
    }
    // how many entities to skip if we are on a certain page:
    const skip = (Math.max(1, page) - 1) * limit;

    // using promise all to wait for more than one promise at the same time:
    const [data, total] = await Promise.all([
      Question.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Question.countDocuments(filter),
    ]);

    res.json({
      data,
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    next(err);
  }
}

async function getOwnedQuestion(id, userId) {
  // TODO:
  // Hint: load by id -> 404 if missing -> 403 if recipient !== userId.
  // Compare as strings (ObjectId). Returns the question doc.
  const question = await Question.findById(id);
  if (!question) {
    throw new HttpError(404, "Question not found");
  }

  if (question.recipient.toString() !== userId.toString()) {
    throw new HttpError(403, "This is not your question");
  }

  return question;
}

export async function answerQuestion(req, res, next) {
  // TODO:
  // Hint: use getOwnedQuestion for 404/403. Set answer, answeredAt=now, status='answered'.
  // If body has visibility, apply it. Save + return the question.
  // See: docs/API.md "POST /api/questions/:id/answer", tester/tests/answer.test.js
  throw new Error("not implemented");
}

export async function updateQuestion(req, res, next) {
  // TODO:
  // Hint: ownership check. Accept any of answer / status / visibility. If answer provided,
  // also set answeredAt + status='answered'. Save + return.
  // See: docs/API.md "PATCH /api/questions/:id", tester/tests/answer.test.js
  throw new Error("not implemented");
}

export async function removeQuestion(req, res, next) {
  // TODO:
  // Hint: ownership check, deleteOne, 204 no content.
  // See: docs/API.md "DELETE /api/questions/:id", tester/tests/answer.test.js
  throw new Error("not implemented");
}

export async function listPublicFeed(req, res, next) {
  // TODO:
  // Hint: find user by :username (404 if missing). Filter questions:
  //   recipient=user._id, status='answered', visibility='public'.
  // Exclude recipient field from response. Sort answeredAt desc. Same pagination envelope as inbox.
  // See: docs/API.md "GET /api/users/:username/questions", tester/tests/public-feed.test.js
  throw new Error("not implemented");
}
