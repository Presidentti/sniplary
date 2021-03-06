const express = require('express');
const Snippet = require('../../models/Snippet');
const bodyParser = require('body-parser');
const router = express.Router();

router.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// @route   GET api/snippet
// @desc    Route for Rickrolling innocent victims // Limited time only!!
// @access  Public
router.get('/', (req, res) => {
  res.redirect('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
});

// @route   POST api/snippet/add
// @desc    Add new snippet to the Sniplary
// @access  Private /*TODO*/
router.post('/addSnippet', async (req, res) => {
  try {
    let { description, snippet } = req.body;


    //Fixing the persintent XSS vuln
    const lt = /</g,
      gt = />/g,
      ap = /'/g,
      ic = /"/g;

    snippet = snippet.toString().replace(lt, "&lt;").replace(gt, "&gt;").replace(ap, "&#39;").replace(ic, "&#34;");

    let snip = new Snippet({
      description,
      snippet,
    });

    await snip.save((err) => {
      if (err) {
        console.log(err);
        res.json({ success: false });
      } else {
        res.status(200).json({ success: true });
      }
    });
  } catch (err) {
    //Only basic error handling here
    console.log(err);
  }
});

// @route   POST api/snippet/search
// @desc    Search the DB for any snippets matching the search criteria
// @access  Private /*TODO*/
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
    //Only basic error handling here
    console.log(err);
  }
});

module.exports = router;
