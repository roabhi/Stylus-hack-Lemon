export const parseCCode = (_code) => {
  const registryRegex = /to_function_selector\("(.+?)"\),\s*(\w+)/g
  const matches = []
  let match

  while ((match = registryRegex.exec(_code)) !== null) {
    matches.push({ selector: match[1], functionName: match[2] })
  }

  const functionDefinitionRegex = /ArbResult\s+(\w+)\((.*?)\)\s*{([\s\S]*?)}/g
  const functionDefinitions = []
  while ((match = functionDefinitionRegex.exec(_code)) !== null) {
    const [_, name, args, body] = match
    functionDefinitions.push({ name, args, body })
  }

  // ? Mappings for parameters
  const typeMappings = {
    uint8_t: 'bytes32',
    size_t: 'uint256',
    // ? Add more mappings as needed ...
  }

  // ? Return type mappings based on the return helpers
  const returnMappings = {
    _return_short_string: 'string',
    _return_success_bebi32: 'uint256',
    // ? Add more mappings as needed ...
  }

  const getFirstParamType = (args) => {
    const params = args.split(',').map((param) => param.trim())
    const [type] = params[0].split(/\s+/)
    return typeMappings[type] || 'unknown'
  }

  const getReturnType = (body) => {
    const returnRegex = /return\s+(_\w+)\(/
    const returnMatch = body.match(returnRegex)
    if (!returnMatch) return 'unknown'

    const returnFunction = returnMatch[1]
    return returnMappings[returnFunction] || 'unknown'
  }

  const isInputUsedInBody = (body) => {
    return /input\s*\*/.test(body)
  }

  const solidityFunctions = matches.map(({ selector, functionName }) => {
    const funcDef = functionDefinitions.find((def) => def.name === functionName)
    if (!funcDef) {
      console.warn(`No definition found for function: ${functionName}`)
      return null
    }

    const { args, body } = funcDef

    const firstParamType = isInputUsedInBody(body)
      ? getFirstParamType(args)
      : null
    const returnType = getReturnType(body)

    if (!returnType || returnType === 'unknown') {
      console.warn(
        `Could not determine return type for function: ${functionName}`
      )
      return null
    }

    const paramsString = firstParamType ? `${firstParamType}` : ''

    return `function ${functionName}(${paramsString}) view returns (${returnType})`
  })

  return solidityFunctions.filter(Boolean)
}
