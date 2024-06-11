const speedTest = require('speedtest-net');

exports.testInternetSpeed = (req, res) => {
    const test = speedTest({ maxTime: 5000 });

    test.on('data', data => {
        res.send({
            uploadSpeed: data.speeds.upload,
            downloadSpeed: data.speeds.download,
            originalData: data
        });
    });

    test.on('error', err => {
        res.status(500).send({ error: err.message });
    });
};
