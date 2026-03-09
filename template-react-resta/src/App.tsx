import { Block } from "@/components/ui/Block";
import { Box } from "@/components/ui/Box";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Group } from "@/components/ui/Group";
import { Stack } from "@/components/ui/Stack";
import { Text } from "@/components/ui/Text";

const featureCards = [
  {
    title: "Utility props",
    description:
      "Configure blocks via a strict utility-props API without mixing styles between components.",
  },
  {
    title: "Variant system",
    description:
      "Buttons and text use CVA variants: types, sizes, and styles are set as explicit props.",
  },
  {
    title: "Composable primitives",
    description:
      "Block, Container, Stack, Group, Box, Text, and Button work as building blocks without manual className.",
  },
];

export default function App() {
  return (
    <Block component="main" min="h-screen" bg="background" p="0">
      <Container component="section" max="w-7xl" px="4" py="8" data-class="welcome-shell">
        <Stack gap="12">
          <Stack component="header" gap="4" items="center">
            <Text
              component="p"
              fontSize="sm"
              fontWeight="semibold"
              textAlign="center"
              textColor="primary"
            >
              UI8Kit
            </Text>
            <Text component="h1" fontSize="5xl" fontWeight="bold" textAlign="center">
              Welcome to UI8Kit
            </Text>
            <Text
              component="p"
              fontSize="lg"
              textAlign="center"
              textColor="muted-foreground"
            >
              A UI component library built as a set of reusable primitives: no inline styles, no
              custom className, with control via typed props.
            </Text>
          </Stack>

          <Group gap="4" flex="wrap" justify="center" items="center">
            <Button variant="default" size="lg" href="#components">
              Explore components
            </Button>
            <Button variant="outline" size="lg" href="#variants">
              Browse variants
            </Button>
            <Button variant="ghost" size="lg">
              Start building
            </Button>
          </Group>

          <Stack component="section" id="components" gap="6">
            <Text component="h2" fontSize="3xl" fontWeight="semibold">
              Used components
            </Text>

            <Group flex="wrap" gap="4" items="stretch">
              <Box
                component="article"
                flex="1"
                p="6"
                bg="card"
                border=""
                rounded="2xl"
                shadow="sm"
                min="w-0"
              >
                <Stack gap="4">
                  <Text component="h3" fontSize="xl" fontWeight="semibold">
                    Block
                  </Text>
                  <Text textAlign="left" textColor="muted-foreground">
                    Base polymorphic container with support for utility-props and semantic component
                    API.
                  </Text>
                  <Button as="a" variant="link" size="sm" href="#">
                    Explore
                  </Button>
                </Stack>
              </Box>
              <Box
                component="article"
                flex="1"
                p="6"
                bg="card"
                border=""
                rounded="2xl"
                shadow="sm"
                min="w-0"
              >
                <Stack gap="4">
                  <Text component="h3" fontSize="xl" fontWeight="semibold">
                    Container
                  </Text>
                  <Text textAlign="left" textColor="muted-foreground">
                    Limits content width via the `max` utility-prop, adding convenient padding.
                  </Text>
                  <Button variant="outline" size="sm" href="#">
                    Details
                  </Button>
                </Stack>
              </Box>
              <Box
                component="article"
                flex="1"
                p="6"
                bg="card"
                border=""
                rounded="2xl"
                shadow="sm"
                min="w-0"
              >
                <Stack gap="4">
                  <Text component="h3" fontSize="xl" fontWeight="semibold">
                    Stack / Group
                  </Text>
                  <Text textAlign="left" textColor="muted-foreground">
                    Stack provides a column layout with default spacing, Group provides a flex row for
                    horizontal layout.
                  </Text>
                  <Group gap="2" items="start">
                    <Button variant="secondary" size="sm">
                      Stack
                    </Button>
                    <Button variant="ghost" size="sm">
                      Group
                    </Button>
                  </Group>
                </Stack>
              </Box>
            </Group>
          </Stack>

          <Stack component="section" id="variants" gap="4">
            <Text component="h2" fontSize="3xl" fontWeight="semibold">
              Variants and tokens
            </Text>
            <Text textColor="muted-foreground">
              Below are the base variants shown directly via `Button` and `Text` props, without manual
              class overrides.
            </Text>
            <Group flex="wrap" gap="2" items="center">
              <Button size="sm" variant="default">
                default
              </Button>
              <Button size="sm" variant="destructive">
                destructive
              </Button>
              <Button size="sm" variant="secondary">
                secondary
              </Button>
              <Button size="sm" variant="outline">
                outline
              </Button>
              <Button size="sm" variant="ghost">
                ghost
              </Button>
              <Button size="sm" variant="link">
                link
              </Button>
            </Group>
            <Group flex="wrap" gap="2" items="center">
              <Text fontSize="sm" textColor="destructive">
                xs
              </Text>
              <Text fontSize="sm" textColor="primary">
                body
              </Text>
              <Text fontSize="base" textColor="secondary">
                base
              </Text>
              <Text fontSize="lg" textColor="accent-foreground">
                lg
              </Text>
              <Text fontSize="2xl" textColor="secondary-foreground">
                2xl
              </Text>
            </Group>
          </Stack>

          <Box component="footer" p="6" rounded="3xl" bg="muted" border="">
            <Stack gap="2" items="center">
              <Text component="p" fontWeight="medium">
                All sections are built from {featureCards.length} feature cards:
              </Text>
              <Group gap="2" flex="wrap" justify="center" items="center">
                {featureCards.map((item) => (
                  <Text
                    key={item.title}
                    fontSize="sm"
                    textColor="muted-foreground"
                    fontWeight="medium"
                  >
                    {item.title}
                  </Text>
                ))}
              </Group>
            </Stack>
          </Box>
        </Stack>
      </Container>
    </Block>
  );
}

