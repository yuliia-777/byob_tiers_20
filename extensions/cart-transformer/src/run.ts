import type {
  RunInput,
  FunctionRunResult,
  CartLine,
  Cart,
} from "../generated/api";

// gid://shopify/ProductVariant/45665204043939    --fable-dev container
// gid://shopify/ProductVariant/41589881864279    --test-dev container

export function run(input: RunInput): FunctionRunResult {
  const groupedItems: Record<string, Pick<CartLine, "id" | "quantity">[]>= {}
  input.cart.lines.forEach(line => {
    const bundleId = line.bundleId
    if (bundleId && bundleId.value) {
      if (!(groupedItems[bundleId.value])) {
        groupedItems[bundleId.value] = []
      }

      groupedItems[bundleId.value].push(line)
    }
  })

  return {
    operations: [
      ...Object.values(groupedItems).map(group => {
        const mergeOperation: CartOperation = {
          merge: {
            cartLines: group.map(line => {
              return {
                cartLineId: line.id,
                quantity: line.quantity
              }
            }),
            parentVariantId: "gid://shopify/ProductVariant/45665204043939"
          }
        }

        return mergeOperation
      })
    ]
  };
};