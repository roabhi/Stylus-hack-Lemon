# Arbitrum Stylus C - FunctionRegistry to Playground ABI

This is an utlity created for the [Arbitrum Stylus Hackathon by Lemon](https://hack.lemon.tips/) based [on this starter template by Denni Portillo](https://github.com/D3Portillo/arbitrum-sylus-starter-c)

This utility will parse your C based smart contract and give you the ABI
code you can paste directly into your playground typescript template so
you can start testing your code right away.

First declare your entry point like this

```
ENTRYPOINT(handler)

```

Then in your handler define the registry array with registered functions you are using in your contract.

```

ArbResult ping_pong(uint8_t *input, size_t len)
{
  if (ft_strnstr(input, "ping", len))
    return _return_short_string(Success, "pong");
  return _return_short_string(Success, "ping");
}

ArbResult calldata_len(uint8_t *input, size_t len)
{
  bebi32_set_u32(buf_out, len);
  return _return_success_bebi32(buf_out);
}

ArbResult hola_mundo(uint8_t *input, size_t len)
{
  return _return_short_string(Success, "Hola Mundo");
}


int handler(size_t argc)
{

...

  FunctionRegistry registry[] = {

      {to_function_selector("calldata_len()"), calldata_len},
      {to_function_selector("ping_pong(bytes32)"), ping_pong},
      {to_function_selector("hola_mundo()"), hola_mundo},
  };
}


...

```

For the hackathon only simple view functions work. If you want to add more
type mappings from C to Solidity feel free to fork the repo and edit the
mappings included in the
`js/modules/parse.js ` either for types
or Stylus based return functions.
