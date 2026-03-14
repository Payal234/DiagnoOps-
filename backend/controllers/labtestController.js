import Test from "../models/LabTest.js";


// get all tests
export const getAllTests = async (req, res) => {
  try {

    const tests = await Test.find();

    res.json(tests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get tests by lab
export const getTestsByLab = async (req, res) => {
  try {

    const tests = await Test.find({ lab: req.params.labId });

    res.json(tests);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get single test
export const getTestById = async (req, res) => {
  try {

    const test = await Test.findById(req.params.id);

    res.json(test);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};