// Do not use this file, it has already been published to NPM

import * as React from 'react'
import { observable, extendObservable } from 'mobx'
import { observer } from 'mobx-react'
import { FormGroup } from 'react-bootstrap'
import * as validator from 'validator'
const ReactBootstrap = require('react-bootstrap')

const ControlLabel = ReactBootstrap.ControlLabel
const FormControl = ReactBootstrap.FormControl
const HelpBlock = ReactBootstrap.HelpBlock

export interface ValidatedInputProps {
  id?: string,
  label: string,
  type?: string,
  componentClass?: string,
  placeholder?: string,
  model: any,
  name: string,
  validate?: string | Function,
  errorHelp?: any,
  renderFunction?: (props: RenderFunctionProps) => any,
}

export interface RenderFunctionProps {
  id?: string,
  label: string,
  type?: string,
  componentClass?: string,
  placeholder?: string,
  name: string,
  changeHandler?: Function,
  value: any,
  help: string,
  validationState: string
}

@observer
export class ValidatedInput extends React.Component<ValidatedInputProps, {}>{
  validateFunc: Function

  constructor(props) {
    super(props)
    const {name, model} = this.props
    // Add current field to observable model
    if (!model[name]) extendObservable(model, { [name]: undefined })
    // Create internal form data field
    if (!model.$mobxInputForm) {
      Object.defineProperty(model, '$mobxInputForm', {
        // To remove this internal field from JSON.stringyfy and such
        enumerable: false,
        value: observable({})
      })
    }
    const form = model.$mobxInputForm
    // Add current field internal form data field
    if (!form[name]) {
      extendObservable(form, {
        [name]: {
          component: this,
          touched: false,
          validationState: null,
          help: null
        }
      })
    }
    this.validateFunc = this.compileValidationRules()
  }

  update = (e) => {
    const {model, name} = this.props
    const form = model.$mobxInputForm
    // It's either value, or change event
    model[name] = e.target ? e.target.value : e
    form[name].touched = true
    this.validateField()
  }

  validateField = (force?: boolean) => {
    const {model, name} = this.props
    const form = model.$mobxInputForm
    const field = form[name]
    const result = this.validateFunc(model[name])
    if (result === true || (!field.touched && !force)) {
      field.validationState = null
      field.help = null
    } else {
      field.validationState = 'error'
      field.help = result
    }
    return result
  }

  getInputErrorMessage(ruleName) {
    let errorHelp = this.props.errorHelp

    if (typeof errorHelp === 'object') {
      // 'required' validation is missing from validatorJS
      if (!errorHelp[ruleName] && ruleName === 'isNull') return errorHelp.required
      return errorHelp[ruleName]
    } else {
      return errorHelp
    }
  }

  // Taken from: https://github.com/heilhead/react-bootstrap-validation/blob/6666b06326d6db33a736de879ce42edc5cdb64b1/src/Form.js#L250
  compileValidationRules() {
    if (!this.props.validate) {
      return () => true
    }
    if (typeof this.props.validate === 'function') {
      return (val) => {
        if (!(this.props.validate as Function)(val)) {
          return this.props.errorHelp
        } else {
          return true
        }
      }
    }
    let rules = (this.props.validate as string).split(',').map(rule => {
      let params = rule.split(':')
      let name = params.shift()
      // 'required' validation is missing from validatorJS
      if (name === 'required') name = '!isNull'
      let inverse = name[0] === '!'

      if (inverse) {
        name = name.substr(1)
      }

      return { name, inverse, params }
    })

    return val => {
      let result = true
      rules.forEach(rule => {
        if (typeof validator[rule.name] !== 'function') {
          throw new Error('Invalid input validation rule "' + rule.name + '"')
        }
        let ruleResult = validator[rule.name](val || '', ...rule.params)

        if (rule.inverse) {
          ruleResult = !ruleResult
        }

        if (result === true && ruleResult !== true) {
          result = this.getInputErrorMessage(rule.name) || false
        }
      })

      return result
    }
  }

  render() {
    const {model, name} = this.props
    const form = model.$mobxInputForm
    const field = form[name]

    const props: RenderFunctionProps = {
      changeHandler: this.update,
      value: model[name]
    } as any

    Object.assign(props, field)
    Object.assign(props, this.props)
    props.id = props.id || props.name

    if (this.props.renderFunction) {
      return this.props.renderFunction(props)
    }

    return (
      <FormGroup controlId={props.id} validationState={props.validationState} >
        <ControlLabel>{props.label} </ControlLabel>
        <FormControl
          id={props.id}
          type={props.type}
          componentClass={props.componentClass}
          placeholder={props.placeholder}
          value={props.value}
          onChange = {props.changeHandler} />
        {props.help && <HelpBlock>{props.help} </HelpBlock>}
      </FormGroup>
    )
  }
}

export const submit = function (model: any) {
  var form = model.$mobxInputForm
  var keys = Object.keys(model)
  var valid = true
  var errors = {}
  var values = {}
  keys.forEach((key) => {
    const value = model[key]
    const field = form[key]
    values[key] = value
    if (!field) {
      console.warn('Form model not present for: ' + key)
    } else if (!field.component) {
      console.warn('Component not linked to form model: ' + key)
    } else {
      const result = field.component.validateField(true)
      if (field.validationState !== null) {
        valid = false
        errors[key] = result
      }
    }
  })
  return { valid, values, errors }
}
