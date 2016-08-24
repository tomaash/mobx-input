# Form validation for [MobX](https://github.com/mobxjs/mobx) and [react-bootstrap](http://react-bootstrap.github.io/).

Taken strong inspiration from: [react-bootstrap-validation](https://github.com/heilhead/react-bootstrap-validation)

## Installation:

`npm install mobx-input --save`

## Usage - Example Form:

```js
import React from 'react'
import { Button } from 'react-bootstrap'
import { ValidatedInput, submit } from 'mobx-input'

export class UserRegisterComponent extends React.Component {
	onSubmit = () => {
		const result = submit(this.props.controller.formData)
		if (result.valid) {
			this.props.controller.registerUser(result.values)
		}
	}

	render() {
		const {appState, controller} = this.props
		const job = appState.currentJob

		return (
			<div className='container'>
				<ValidatedInput
					type='text'
					label='First Name'
					name='firstName'
					validate='required'
					model={controller.formData}
					errorHelp={{
						required: 'First Name is required'
					}}
					/>
				<ValidatedInput
					type='text'
					label='Last Name'
					name='lastName'
					validate='required'
					model={controller.formData}
					errorHelp={{
						required: 'Last Name is required'
					}}
					/>
				<ValidatedInput
					type='text'
					label='Email'
					name='emailAddress'
					validate='required,isEmail'
					model={controller.formData}
					errorHelp={{
						isEmail: 'Email is invalid',
						required: 'Email is required'
					}}
					/>
				<ValidatedInput
					type='password'
					label='Password'
					name='password'
					validate='required,isLength:4:60'
					model={controller.formData}
					errorHelp={{
						isLength: 'Password must be at least 4 characters long',
						required: 'Password is required'
					}}
					/>
				<Button
					type='submit'
					bsSize='large'
					onClick={this.onSubmit}
					bsStyle='primary'> Register
				</Button>
			</div>
		)
	}
}
```

Just provide any MobX observable object as `model` to all form fields. All values and validation data will be stored there. Pass this object to `submit` function to trigger validations for untouched components. Validation rules are specified in `validate` attribute, and error messages in `errorHelp`

### `ValidatedInput`

An extension of react-bootstrap's `Input` component. Should be used instead of the original one for all the fields that need to be validated. All `ValidatedInput`s should have `name` property defined.

**Properties**

##### `name: String` **required**
This property is inherited from `Input` with only difference that it is required for `ValidatedInput`.

```js
<ValidatedInput
	name='email'
	validate='required,isEmail'
/>
```

##### `validate: String`

Validation rule is a combination of validator.js method names separated with comma.
```js
<ValidatedInput
	name='email'
	validate='required,isEmail,isLength:5:60'
/>
```
In the example above, input's value will be validated with three methods. `isLength` method also receives additional params. Inverse rules (like `!isNull`) are supported, although in `errorHelp` object they're looked up without the exclamation mark.

##### `errorHelp: Object|String`
Can be either a string with error text or an object with map `ruleName => errorText`.
```js
<ValidatedInput
	name="email"
	validate='required,isEmail',
	errorHelp={{
		required: 'Please enter your email',
		isEmail: 'Invalid email'
}}
/>
```

##### `model: Object`
Any MobX observable object to store all form data

### Custom render function and validation function
It's also possible to provide custom render and validation functions to allow for different design or specialized validated components
```js
const telephoneInputRenderer = 

<ValidatedInput
	label='Phone number'
	name='callNumber'
	validate={(x) => PhoneNumber.parse(x)}
	errorHelp='Phone number is not valid'
	model={appState.currentForm}
	renderFunction={(props) => 
		<FormGroup controlId={props.id} validationState={props.validationState} >
			<ControlLabel>{props.label} </ControlLabel>
			<ReactTelephoneInput
				id={props.id}
				defaultCountry='nl'
				flagsImagePath='/images/flags.png'
				value={props.value}
				onChange={this.handlePhoneChange.bind(this, props.changeHandler)}
				/>
			{props.help && <HelpBlock>{props.help} </HelpBlock>}
		</FormGroup>
	}
/>  
```

... More docs soon ...