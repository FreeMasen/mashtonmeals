var crypto = require('crypto')

var algorithm = 'aes-256-gcm'
var key = '3zTvzr3p67VC61jmV54rIYu1545x4TlY'
module.exports = {
    var encrypt = function (text) {
        console.log('encrypting')
        var iv = new Buffer(12);
        console.log('created iv: ' + iv)
        var cipher = crypto.createCipheriv(algorithm, key, iv);
        console.log('created cipher' + JSON.stringify(cipher))
        var encrypted = cipher.update(text, 'utf8', 'hex');
        console.log('encrypted: ' + encrypted)
        encrypted += cipher.final('hex')
        console.log('added final: ' + encrypted)
        var tag = cipher.getAuthTag();

        console.log('start: ' + text + ' encrypted: ' + encrypted + ' tag: ' + tag)
        return {
            content: encrypted,
            tag: tag
        }
    }

    var decrypt = function (encrypted) {
        console.log('decrypting');
        var iv = new Buffer(12);
        console.log('created iv: ' + iv);
        var decipher = crypto.createDecipheriv(algorithm, key, iv);
        console.log('created decipher: ' + JSON.stringify(decipher));
        decipher.setAuthTag(encrypted.tag);
        console.log('setting auth tag')
        var decrypted = decipher.update(encrypted.content, 'hex', 'utf8');
        console.log('decripted: ' + decrypted)
        decrypted += decipher.final('utf8')
        console.log('added final: ' + decrypted)
        return decrypted
    }
}

// console.log("starting test");
// console.log('----------');
// console.log('text = PartyPartyParty');
//
// decrypt(encrypt('PartyPartyParty'));