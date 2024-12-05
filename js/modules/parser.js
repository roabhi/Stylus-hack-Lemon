export const parseCCode = (_code) => {
  const registryRegex = /to_function_selector\("(.+?)"\),\s*(\w+)/g
  const matches = []
  let match

  // Step 1: Extract registry entries
  while ((match = registryRegex.exec(_code)) !== null) {
    matches.push({ selector: match[1], functionName: match[2] })
  }

  // Step 2: Extract ArbResult functions and their definitions
  const functionDefinitionRegex = /ArbResult\s+(\w+)\((.*?)\)\s*{([\s\S]*?)}/g
  const functionDefinitions = []
  while ((match = functionDefinitionRegex.exec(_code)) !== null) {
    const [_, name, args, body] = match
    functionDefinitions.push({ name, args, body })
  }

  // Step 3: Type mappings for parameters (only for first parameter)
  const typeMappings = {
    uint8_t: 'bytes32', // input is treated as bytes32
    size_t: 'uint256', // len is used but ignored in the function signature
  }

  // Step 4: Return type mappings based on the return helpers
  const returnMappings = {
    _return_short_string: 'string',
    _return_success_bebi32: 'uint256',
    // Add more mappings as needed
  }

  // Helper: Parse arguments and extract the first parameter's type
  const getFirstParamType = (args) => {
    const params = args.split(',').map((param) => param.trim())
    const [type] = params[0].split(/\s+/) // Extract type from "type name"
    return typeMappings[type] || 'unknown'
  }

  // Helper: Determine the return type from the body
  const getReturnType = (body) => {
    const returnRegex = /return\s+(_\w+)\(/
    const returnMatch = body.match(returnRegex)
    if (!returnMatch) return 'unknown'

    const returnFunction = returnMatch[1]
    return returnMappings[returnFunction] || 'unknown'
  }

  // Helper: Check if input is used in the function body
  const isInputUsedInBody = (body) => {
    return /input\s*\*/.test(body) // Checks if 'input' is mentioned in the function body
  }

  // Step 5: Generate Solidity function strings
  const solidityFunctions = matches.map(({ selector, functionName }) => {
    const funcDef = functionDefinitions.find((def) => def.name === functionName)
    if (!funcDef) {
      console.warn(`No definition found for function: ${functionName}`)
      return null
    }

    const { args, body } = funcDef

    // If 'input' is used in the body, include it in the function signature
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

    // If input is used, include it as a parameter; otherwise, no parameters are included
    const paramsString = firstParamType ? `${firstParamType}` : ''

    return `function ${functionName}(${paramsString}) view returns (${returnType})`
  })

  return solidityFunctions.filter(Boolean) // Filter out null entries
}
