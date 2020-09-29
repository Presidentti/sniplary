function delay(fn, ms) {
  let timer = 0
  return function (...args) {
    clearTimeout(timer)
    timer = setTimeout(fn.bind(this, ...args), ms || 0)
  }
}

function searchString(search) {
  document.querySelector('#searchCriteria').value = search;
}

document.querySelector('#searchCriteria').addEventListener(
  'keyup',
  delay(async function (e) {
    document.querySelector('.snippetsContainer').innerHTML = '';
    document.querySelector('.snippetsList').innerHTML = '';

    await fetch('/api/snippet/search', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        searchString: document.querySelector('#searchCriteria').value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success == true) {
          let arr = data.results.map((result) => result);
          let numOfResults = document.querySelector('#results');

          if ($('#searchCriteria').is(':focus')) {
            for (let i = 0; i < arr.length; i++) {
              $('.snippetsList').append(
                `<li onclick="searchString('${arr[i].description}')">${arr[i].description}</li>`
              );
            }
          }

          if (
            arr.length === 1
              ? (numOfResults.innerText = `Found ${arr.length} snippet matching your search criteria.`)
              : (numOfResults.innerText = `Found ${arr.length} snippets matching your search criteria.`)
          )
            // Append snippets matching search criteria to the DOM
            for (let i = 0; i < arr.length; i++) {
              $('.snippetsContainer').append(
                `<div class="snippet mt-5"><p class="description">${arr[i].description}</p><pre><code class="javascript">${arr[i].snippet}</code></pre></div>`
              );
            }

          // Call Highlight.js for syntax highlighting for all elements appended to the DOM
          document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightBlock(block);
          });
        } else {
          console.log('Something went wrong, blame the goblins');
        }
      });
  }, 250)
);
