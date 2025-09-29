import { BlockSchema } from "types/main/entryjs/schema";
import { EntryFunctionSchema, makeBlockSchema } from "../blockExtension";

const defaultBlockData: Record<string, EntryFunctionSchema> = {
  exp: {
    variables: ["result"],
    content: [
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_9w8r",
          {
            "type": "calc_operation",
            "params": [
              null,
              {
                "type": "calc_basic",
                "params": [
                  {
                    "type": "stringParam_59dh"
                  },
                  "DIVIDE",
                  {
                    "type": "number",
                    "params": [
                      "2.302585092994045684"
                    ]
                  }
                ]
              },
              null,
              "round"
            ]
          },
          null
        ]
      },
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_xwi8",
          {
            "type": "calc_basic",
            "params": [
              {
                "type": "stringParam_59dh"
              },
              "MINUS",
              {
                "type": "calc_basic",
                "params": [
                  {
                    "type": "get_func_variable",
                    "params": [
                      "8h3o_9w8r",
                      null
                    ]
                  },
                  "MULTI",
                  {
                    "type": "number",
                    "params": [
                      "2.302585092994045684"
                    ]
                  }
                ]
              }
            ]
          },
          null
        ]
      },
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_jgjd",
          {
            "type": "calc_operation",
            "params": [
              null,
              {
                "type": "calc_operation",
                "params": [
                  null,
                  {
                    "type": "calc_operation",
                    "params": [
                      null,
                      {
                        "type": "calc_operation",
                        "params": [
                          null,
                          {
                            "type": "calc_operation",
                            "params": [
                              null,
                              {
                                "type": "calc_operation",
                                "params": [
                                  null,
                                  {
                                    "type": "calc_operation",
                                    "params": [
                                      null,
                                      {
                                        "type": "calc_operation",
                                        "params": [
                                          null,
                                          {
                                            "type": "calc_basic",
                                            "params": [
                                              {
                                                "type": "number",
                                                "params": [
                                                  "1"
                                                ]
                                              },
                                              "PLUS",
                                              {
                                                "type": "calc_basic",
                                                "params": [
                                                  {
                                                    "type": "get_func_variable",
                                                    "params": [
                                                      "8h3o_xwi8",
                                                      null
                                                    ]
                                                  },
                                                  "DIVIDE",
                                                  {
                                                    "type": "number",
                                                    "params": [
                                                      "256"
                                                    ]
                                                  }
                                                ]
                                              }
                                            ]
                                          },
                                          null,
                                          "square"
                                        ]
                                      },
                                      null,
                                      "square"
                                    ]
                                  },
                                  null,
                                  "square"
                                ]
                              },
                              null,
                              "square"
                            ]
                          },
                          null,
                          "square"
                        ]
                      },
                      null,
                      "square"
                    ]
                  },
                  null,
                  "square"
                ]
              },
              null,
              "square"
            ]
          },
          null
        ]
      },
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_jgjd",
          {
            "type": "calc_basic",
            "params": [
              {
                "type": "get_func_variable",
                "params": [
                  "8h3o_jgjd",
                  null
                ]
              },
              "MULTI",
              {
                "type": "calc_basic",
                "params": [
                  {
                    "type": "number",
                    "params": [
                      "1"
                    ]
                  },
                  "PLUS",
                  {
                    "type": "calc_basic",
                    "params": [
                      {
                        "type": "get_func_variable",
                        "params": [
                          "8h3o_xwi8",
                          null
                        ]
                      },
                      "MINUS",
                      {
                        "type": "calc_operation",
                        "params": [
                          null,
                          {
                            "type": "get_func_variable",
                            "params": [
                              "8h3o_jgjd",
                              null
                            ]
                          },
                          null,
                          "ln"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          null
        ]
      },
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_jgjd",
          {
            "type": "calc_basic",
            "params": [
              {
                "type": "get_func_variable",
                "params": [
                  "8h3o_jgjd",
                  null
                ]
              },
              "MULTI",
              {
                "type": "calc_basic",
                "params": [
                  {
                    "type": "number",
                    "params": [
                      "1"
                    ]
                  },
                  "PLUS",
                  {
                    "type": "calc_basic",
                    "params": [
                      {
                        "type": "get_func_variable",
                        "params": [
                          "8h3o_xwi8",
                          null
                        ]
                      },
                      "MINUS",
                      {
                        "type": "calc_operation",
                        "params": [
                          null,
                          {
                            "type": "get_func_variable",
                            "params": [
                              "8h3o_jgjd",
                              null
                            ]
                          },
                          null,
                          "ln"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          null
        ]
      },
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_jgjd",
          {
            "type": "calc_basic",
            "params": [
              {
                "type": "get_func_variable",
                "params": [
                  "8h3o_jgjd",
                  null
                ]
              },
              "MULTI",
              {
                "type": "calc_basic",
                "params": [
                  {
                    "type": "number",
                    "params": [
                      "1"
                    ]
                  },
                  "PLUS",
                  {
                    "type": "calc_basic",
                    "params": [
                      {
                        "type": "get_func_variable",
                        "params": [
                          "8h3o_xwi8",
                          null
                        ]
                      },
                      "MINUS",
                      {
                        "type": "calc_operation",
                        "params": [
                          null,
                          {
                            "type": "get_func_variable",
                            "params": [
                              "8h3o_jgjd",
                              null
                            ]
                          },
                          null,
                          "ln"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          null
        ]
      },
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_jgjd",
          {
            "type": "calc_basic",
            "params": [
              {
                "type": "get_func_variable",
                "params": [
                  "8h3o_jgjd",
                  null
                ]
              },
              "MULTI",
              {
                "type": "calc_basic",
                "params": [
                  {
                    "type": "number",
                    "params": [
                      "1"
                    ]
                  },
                  "PLUS",
                  {
                    "type": "calc_basic",
                    "params": [
                      {
                        "type": "get_func_variable",
                        "params": [
                          "8h3o_xwi8",
                          null
                        ]
                      },
                      "MINUS",
                      {
                        "type": "calc_operation",
                        "params": [
                          null,
                          {
                            "type": "get_func_variable",
                            "params": [
                              "8h3o_jgjd",
                              null
                            ]
                          },
                          null,
                          "ln"
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          null
        ]
      },
      {
        "type": "set_func_variable",
        "params": [
          "8h3o_jgjd",
          {
            "type": "calc_basic",
            "params": [
              {
                "type": "replace_string",
                "params": [
                  null,
                  {
                    "type": "combine_something",
                    "params": [
                      null,
                      {
                        "type": "text",
                        "params": [
                          "1e+"
                        ]
                      },
                      null,
                      {
                        "type": "get_func_variable",
                        "params": [
                          "8h3o_9w8r",
                          null
                        ]
                      },
                      null
                    ]
                  },
                  null,
                  {
                    "type": "text",
                    "params": [
                      "+-"
                    ]
                  },
                  null,
                  {
                    "type": "text",
                    "params": [
                      "-"
                    ]
                  },
                  null
                ]
              },
              "MULTI",
              {
                "type": "get_func_variable",
                "params": [
                  "8h3o_jgjd",
                  null
                ]
              }
            ]
          },
          null
        ]
      }
    ].map(x => makeBlockSchema(x)),
    result: makeBlockSchema({
      "type": "get_func_variable",
      "params": [
        "8h3o_jgjd",
        null
      ]
    })
  }
}

export default defaultBlockData