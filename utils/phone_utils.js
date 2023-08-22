function normalizeNumber(number) {
    return number.replace(/[\(\)\- ]/g, '');
}

function parsingSms(data) {
    const message = [];
    const message_list = data.split("|*smsEntityArrayList*|");

    for (var i = 0; i < message_list.length; i++) {
        message.push(message_list[i].split("|*smsEntity*|"));
    }
    return message;
}

function parsingContact(data) {
    const contacts = [];
    const contact_list = data.split("|*telEntityArrayList*|");

    for (var i = 0; i < contact_list.length; i++) {
        contacts.push(contact_list[i].split("|*telEntity*|"));
    }
    return contacts;
}

function parsingCalllog(data) {
    const calllogs = [];
    const calllog_list = data.split("|*callEntityArrayList*|");

    for (var i = 0; i < calllog_list.length; i++) {
        calllogs.push(calllog_list[i].split("|*callEntity*|"));
    }
    return calllogs;
}

module.exports = {
    normalizeNumber,
    parsingSms,
    parsingContact,
    parsingCalllog,
};