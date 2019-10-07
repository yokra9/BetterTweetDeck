import {isObject} from 'lodash';
import moduleRaid from 'moduleraid';

import {maybeRemoveRedirection} from './features/removeRedirection';
import {maybeSetupDebugFunctions} from './services/debugMethods';

// Declare typings on the window
declare global {
  interface Window {
    TD: unknown;
  }
}

let mR;
try {
  mR = moduleRaid();
} catch (e) {
  //
}

// Grab TweetDeck's jQuery from webpack
const TweetDeck = window.TD;
const jQuery: JQuery | undefined = mR && mR.findFunction('jQuery') && mR.findFunction('jquery:')[0];

if (isObject(TweetDeck)) {
  maybeSetupDebugFunctions();
  maybeRemoveRedirection(TweetDeck);
}

console.log('Hello from inject');
