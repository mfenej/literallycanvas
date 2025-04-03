try
  React = require 'react'
catch
  React = window.React

unless React?
  throw "Can't find React"

# Shim React.createFactory (removed in React 19)
unless React.createFactory
  React.createFactory = (Component) ->
    (props, children...) ->
      React.createElement(Component, props, children...)

# Optional: Shim createReactClass if needed
unless React.createClass
  try
    React.createClass = require 'create-react-class'
  catch
    console.warn("Warning: create-react-class not found. Some components may break.")

module.exports = React