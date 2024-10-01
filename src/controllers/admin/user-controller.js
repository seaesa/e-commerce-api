import HttpError from '../../services/httpErrorService.js';
import UserService from '../../services/dbServices/userService.js';

const get = async (req, res, next) => {
  try {
    const result = await UserService.get(req);
    res.json(result);
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }
};
const store = async (req, res, next) => {
  try {
    const fileName = req.generatedFileName;
    const filePath = req.generatedFilePath;
    const user = await UserService.store(req, fileName, filePath);

    const response = {
      status: 'success',
      message: 'User added successfully',
      data: {
        user
      }
    };

    res.json(response);
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }
};

const edit = async (req, res, next) => {
  const userId = req.params.userId;

  try {
    const user = await UserService.find(userId);

    const response = {
      status: 'success',
      message: 'User found successfully',
      data: {
        user
      }
    };

    res.json(response);
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }
};
const update = async (req, res, next) => {
  const userId = req.params.userId;
  const fileName = req.generatedFileName;
  const filePath = req.generatedFilePath;

  try {
    let user = await UserService.find(userId);

    if (!user) {
      const error = new HttpError('Could not find a user for the provided id.', 404);
      return next(error);
    }

    user = await UserService.update(userId, req.body, fileName, filePath);

    const response = {
      status: 'success',
      message: 'User updated successfully',
      data: {
        user
      }
    };

    res.json(response);
  } catch (error) {
    const err = new HttpError(error, 500);
    return next(err);
  }
};

const destroy = async (req, res, next) => {
  const userId = req.params.userId;
  const result = await UserService.destroy(userId);

  if (!result) {
    const error = new HttpError('Something went wrong. Please try again later.', 404);
    return next(error);
  }

  res.json({ status: 'success', message: 'User deleted successfully' });
};

const count = async (req, res, next) => {
  let totalUsers = 0;

  try {
    totalUsers = await UserService.count();
  } catch (err) {
    const error = new HttpError(err, 500);
    return next(error);
  }

  res.json({ totalUsers });
};
const bulkAction = async (req, res, next) => {
  try {
    await UserService.bulkAction(req.body);
  } catch (err) {
    throw new HttpError(err.message, 500);
  }

  res.json({ status: 'success', message: 'User updated successfully' });
};

export default { get, store, edit, update, destroy, bulkAction, count };
