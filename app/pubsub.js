const PubNub = require('pubnub');

const credentials = {
  publishKey: 'pub-c-6b237561-a5db-443a-905c-5e892476a6cf',
  subscribeKey: 'sub-c-e0648543-5332-4bbb-98c7-94c0c1637c40',
  userId: 'sec-c-YTZhMWNmMTgtNDZlZC00NmIwLTkwNjUtNGQ4YjAzOTgwNWQ4'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN',
    TRANSACTION: 'TRANSACTION'
};
  
class PubSub {
  constructor({blockchain, transactionPool}) {
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;


    this.pubnub = new PubNub(credentials);
      
    this.pubnub.subscribe({ channels: [Object.values(CHANNELS)] });
    this.pubnub.addListener(this.listener());
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain)
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction)
    })
  }

  // Subscribe to te channnels method
  subscribeToChannels() {
    this.pubnub.subscribe({
      channels: [Object.values(CHANNELS)]
    });
  }

  listener() {
    return {
      message: messageObject => {
        const { channel, message } = messageObject;
  
        console.log(`Message received. Channel: ${channel}. Message; ${message}`);

        const parsedMessage = JSON.parse(message);

        switch(channel) {
          case CHANNELS.BLOCKCHAIN:
            this.blockchain.replaceChain(parsedMessage, true, () => {
              this.transactionPool.clearBlockchainTransactions({
                chain: parsedMessage
              })
            });
            break;
          case CHANNELS.TRANSACTION:
            if (!this.transactionPool.existingTransaction({
              inputAddress: this.wallet.publicKey
            })) {
              this.transactionPool.setTransaction(parsedMessage);
            }
            break;
          default:
            return;
        }
      }
    };
  }
 
  // Publisher of the channnel
  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
  }
    
}

module.exports = PubSub;