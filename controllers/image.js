const handleApiCall = (req, res) => {
    // Your PAT (Personal Access Token) can be found in the portal under Authentication
    const PAT = '01ee86a4498f42448cca0c75cf72a08e';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'johnny11';       
    const APP_ID = 'face_recognition_brain';
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    const IMAGE_URL = req.body.input;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };
  
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/outputs", requestOptions)
    .then(response => response.json())
    .then(output => res.json(output))
    .catch(err => res.status(400).json('unable to get output'))
}

const handleImage = (req, res, db) => {
    const {id} = req.body;
    db('users')
        .where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => res.json(entries[0].entries))
        .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage,
    handleApiCall
}