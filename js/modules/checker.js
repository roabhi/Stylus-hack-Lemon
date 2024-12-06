export const checkEntryPoint = (_code) => {
  const entrypointRegex = /ENTRYPOINT\((\w+)\)/

  const entrypointMatch = _code.match(entrypointRegex)

  if (!entrypointMatch) {
    alert('Your contract does not have a proper ENTRYPOINT')
    return
  }

  const entrypointFunction = entrypointMatch[1]

  const functionRegex = new RegExp(`\\b${entrypointFunction}\\b\\s*\\(`)

  if (!functionRegex.test(_code)) {
    alert('Your contract does not have a proper ENTRYPOINT')
    return
  }
}

export const checkRegisterFunctionArray = (_code) => {
  const registryRegex = /FunctionRegistry\s+registry\[\]\s*=\s*{[\s\S]*?};/

  if (!registryRegex.test(_code)) {
    alert(
      'Your contract does not implement a FunctionRegistry array of declared functions'
    )
    return
  }
}
