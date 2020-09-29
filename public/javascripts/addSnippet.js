document
  .querySelector('#addSnippet')
  .addEventListener('submit', async function (e) {
    e.preventDefault();

    let newSnippet = {
      description: document.querySelector('#snippetDescription').value,
      snippet: document.querySelector('#snippet').value,
    };

    await fetch('api/snippet/addSnippet', {
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-type': 'application/json',
      },
      body: JSON.stringify(newSnippet),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success === true) {
          document.querySelector('#snippetDescription').value = '';
          document.querySelector('#snippet').value = '';
          toastr["info"]('Snippet added succesfully');
        } else {
          toastr["error"]('Something went horribly wrong');
        }
      });
  });
