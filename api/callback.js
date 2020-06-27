const axios = require('axios')

module.exports = (req, res) => {
    const url = "https://github.com/login/oauth/access_token"
    const CLIENT_ID = process.env.GH_CLIENT_ID
    const CLIENT_SECRET = process.env.GH_CLIENT_SECRET
    var extra = ""
    axios.defaults.headers.post['Content-Type'] = 'application/json';
    const code = req.query["code"]
    if (process.env.ENV == "PROD") {
        extra = "/customizer"
    }
    if (code != undefined) {
        // means github has given us the code to generate an access token with
        axios.post(url, {
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                code: code,
            })
            .then(function(response) {
                data = response.data.split("&")
                for (var idx of data) {
                    if (idx.startsWith("access_token")) {
                        var i = data.indexOf(idx)
                        var tmp = idx.split("=")
                        var token = tmp[1]
                    }
                }
                res.status(200).send(`<head><meta http-equiv="Refresh" content="0; URL=${extra}/?token=${token}"></head>`)
            })
            .catch(function(error) {
                res.status(200).send(`<head><meta http-equiv="Refresh" content="0; URL=${extra}/?error=${encodeURIComponent(error)}"></head>`)
            });
    } else if (Object.keys(req.query).length != 0) {
        // probably means github gave an error
        res.status(200).send(`<head><meta http-equiv="Refresh" content="0; URL=${extra}/?error=${encodeURIComponent(req.query)}"></head>`)
    } else {
        // if we get here, we didn't have any other random URL params, or the code that we need to generate the access token, so we need to get github to give it to us.
        //res.status(200).send(`<head><meta http-equiv="Refresh" content="0; URL=https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=gist&redirect_uri=${encodeURIComponent(host+"/api/callback")}"></head>`)
        res.status(200).send(`<head><meta http-equiv="Refresh" content="0; URL=https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&scope=gist"></head>`)
    }
}