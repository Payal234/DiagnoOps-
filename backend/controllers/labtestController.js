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

// create a new test
export const createTest = async (req, res) => {
  try {
    const {
      name,
      price,
      category,
      type,
      time,
      description,
      lab,
      whyNeeded,
      preparation,
      precautions,
      procedure,
      resultMeaning,
    } = req.body;

    const test = new Test({
      name,
      price,
      category,
      type,
      time,
      description,
      lab,
      whyNeeded,
      preparation,
      precautions,
      procedure,
      resultMeaning,
    });

    await test.save();

    res.status(201).json(test);
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

// update an existing test
export const updateTest = async (req, res) => {
  try {
    const updated = await Test.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete a test
export const deleteTest = async (req, res) => {
  try {
    const deleted = await Test.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Test not found" });
    }

    res.json({ message: "Test deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
