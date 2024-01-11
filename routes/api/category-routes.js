const router = require("express").Router();
const { Category, Product } = require("../../models");

// Get all categories with their associated products
router.get("/", async (req, res) => {
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Get a category by its ID with its associated products
router.get("/:id", async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });

    if (!categoryData) {
      res.status(404).json({ message: "No category found with that ID!" });
      return;
    }

    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Create a new category
router.post("/", async (req, res) => {
  try {
    const newCategory = await Category.create(req.body);
    res.status(201).json(newCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Update a category by ID and respond with the updated object
router.put("/:id", async (req, res) => {
  try {
    await Category.update(
      { category_name: req.body.category_name },
      { where: { id: req.params.id } }
    );

    // Fetch the updated category
    const updatedCategory = await Category.findByPk(req.params.id);

    res.status(200).json(updatedCategory);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Delete a category by its ID
router.delete("/:id", async (req, res) => {
  try {
    const currentCategory = await Category.findByPk(req.params.id);
    // Reset the associations to nothing
    await currentCategory.setProducts([]);
    
    const categoryData = await currentCategory.destroy();

    if (!categoryData) {
      res.status(404).json({ message: "There is no category with this ID." });
    }

    res.status(200).json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;