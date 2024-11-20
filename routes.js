const express = require('express');
const fs = require('fs');
const generateSchema = require('./schemaGenerator');
const router = express.Router();

const readData = () => JSON.parse(fs.readFileSync('data.json', 'utf8'));
const writeData = (data) => fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

router.get('/api/oauth/authorize', (req, res) => {
    res.sendFile(__dirname + '/consent.html');
});

router.post('/api/oauth/token', (req, res) => {
    res.json({
        access_token: 'fb95ca22026a4f1f6d393e6c6fded6b9ae79046d98ad9b67804431461dce14576bc0f0f04515c1c14e1f9ce9df37583696780440c503dd8ade2a0abbbea17d5f',
        token_type: 'Bearer',
        expires_in: 31536000, // 3 years in seconds
        refresh_token: 'ya0e51e14c46af5661354f088791e2ce51c3504dfbb6ad0afc793cf3653af46fb672246a2b93c93539409e5a47edec427c040729c2add795de456523a6d2f0e77'
    });
});

router.post('/api/dataio/getTypeNames', (req, res) => {
    res.json({
        typeNames: [
            {
                typeName: 'Employee',
                label: 'The employee system of record'
            }
        ]
    });
});

router.post('/api/dataio/getTypeDefinitions', (req, res) => {
    const data = readData();
    const schema = generateSchema(data, 'Employee', 'EmployeeId');
    res.json(schema);
});

router.post('/api/dataio/patchRecord', (req, res) => {
    const { recordId, data } = req.body;
    let records = readData();
    const recordIndex = records.findIndex(record => record.EmployeeId == recordId);
    if (recordIndex === -1) {
        return res.json({ success: false });
    }
    records[recordIndex] = { ...records[recordIndex], ...data };
    writeData(records);
    res.json({ success: true });
});

router.post('/api/dataio/searchRecords', (req, res) => {
    const { query } = req.body;
    const { attributesToSelect, queryFilter } = query;
    const { operation } = queryFilter;
    const { leftOperand, operator, rightOperand } = operation;

    let records = readData();

    const matchingRecord = records.find(record => {
        const leftValue = record[leftOperand.name];
        const rightValue = rightOperand.name;

        switch (operator) {
            case 'EQUALS':
                return leftValue == rightValue;
            case 'NOT_EQUALS':
                return leftValue != rightValue;
            case 'CONTAINS':
                return leftValue.includes(rightValue);
            case 'STARTS_WITH':
                return leftValue.startsWith(rightValue);
            default:
                return leftValue == rightValue;
        }
    });

    if (!matchingRecord) {
        return res.json({ records: [{ EmployeeId: "Error" }] });
    }

    const selectedRecord = attributesToSelect.reduce((acc, attr) => {
        if (matchingRecord[attr] !== undefined) {
            acc[attr] = matchingRecord[attr];
        }
        return acc;
    }, {});

    res.json({ records: [selectedRecord] });
});

router.post('/api/dataio/createRecord', (req, res) => {
    const { typeName, data } = req.body;
    let records = readData();

    if (records.some(record => record.EmployeeId == data.EmployeeId)) {
        return res.json({ recordId: "Error" });
    }

    records.push(data);
    writeData(records);
    res.json({ recordId: data.EmployeeId });
});

module.exports = router;