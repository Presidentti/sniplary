const express = require('express');
const Snippet = require('../../models/Snippet');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// @route   POST api/snippet/add
// @desc    Add new snippet to the Sniplary
// @access  Private
router.post('/addSnippet', async (req, res) => {
  try {
    const { description, snippet } = req.body;

    let snip = new Snippet({
      description,
      snippet,
    });

    await snip.save();

    // TODO //
    //Use the Fetch API instead of regular form submission and inform the user after successful submission
    res.redirect('/');
  } catch (err) {
    console.log(err);
  }
});

// @route   POST api/snippet/search
// @desc    Search the DB for snippets matching search criteria
// @access  Private
router.post('/search', async (req, res, next) => {
  const { searchString } = req.body;

  let keywords = searchString
    .split(/\s+/)
    .map((kw) => `"${kw}"`)
    .join(' ');

  try {
    await Snippet.find({ $text: { $search: keywords } }, (err, docs) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        res.json({
          success: true,
          results: docs.map((docs) => docs),
        });
      }
    });
  } catch (err) {
    if (err) {
      console.log(err);
    }
  }
});

module.exports = router;
