# MobX Translate

## Installation:

`npm install mobx-translate --save`

## Usage

First, create interface for your translations:

```js
export interface TranslationKeys {
  list: {
    HEADING
    MORE
  },
  widget: {
    HELLO
    BYE
  }
}
```

Then, define your strings. With code completion for keys, and full Mustache template support in values:

```js
import {TranslationKeys} from './translation-keys';

export const EN:TranslationKeys = {
  list: {
    HEADING: 'Available jobs',
    MORE: 'More'
  },
  widget: {
    HELLO: 'Hello {{name}}',
    BYE: 'Bye {{name}}'
  }
}

export const DE:TranslationKeys = {
  list: {
    HEADING: "Verfügbare Berufe",
    MORE: "Mehr"
  },
  widget: {
    HELLO: "Gutten tag {{name}}",
    BYE: "Auf wiedersehn {{name}}"
  }
}
```

Initialize MobxTranslate, pass your translations interface as a generic:

```js
import {TranslationKeys} from './strings/translation-keys';
import {MobxTranslate} from './mobx-translate';

import {EN} from './strings/en';
import {DE} from './strings/de';

const translateInstance = new MobxTranslate<TranslationKeys>();

translateInstance.loadStrings('EN', EN);
translateInstance.loadStrings('DE', DE);
translateInstance.setLanguage('EN');

export const trans = translateInstance;
```

And then easily switch languages and translate strings in React components. Again, with code completion for translation keys!:

```js
import * as React from 'react';
import {observer} from 'mobx-react';

import {trans} from '../stores/translate';

@observer
export class Foo extends React.Component<{}, {}> {
  render() {
    return (
    <div className="container">
      <h1>{trans.key.widget.HELLO({name: 'Joe'})}</h1>
      <button onClick={trans.setLanguage.bind(trans,'EN')}>EN</button>
      <button onClick={trans.setLanguage.bind(trans,'DE')}>DE</button>
      <h1>{trans.key.list.HEADING()}</h1>
    </div>)
  }
}
```
