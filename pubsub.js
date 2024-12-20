const PubNub = require('pubnub');


const credentials = {
  publishKey: 'pub-c-6b237561-a5db-443a-905c-5e892476a6cf',
  subscribeKey: 'sub-c-e0648543-5332-4bbb-98c7-94c0c1637c40',
  userId: 'sec-c-YTZhMWNmMTgtNDZlZC00NmIwLTkwNjUtNGQ4YjAzOTgwNWQ4'
};

const CHANNELS = {
    TEST: 'TEST',
    BLOCKCHAIN: 'BLOCKCHAIN'
};
  
class PubSub {
  constructor({blockchain}) {
    this.blockchain = blockchain;

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

        if (channel === CHANNELS.BLOCKCHAIN) {
          this.blockchain.replaceChain(parsedMessage);
        }
      }
    };
  }
 
  // Publisher of the channnel
  publish({ channel, message }) {
    this.pubnub.publish({ channel, message });
    // this.subscriber.unsubscribe(channel, () => {
    //   this.publish.publish(channel, message, () => {
    //     this.subscriber.subscribe(channel);
    //   });
    // });
  }
    
}

module.exports = PubSub;