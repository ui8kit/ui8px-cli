import { Badge, Block, Button, Card, Container, Group, Stack, Text, Title } from "@/components";

const focusTracks = [
  {
    label: "01",
    title: "Systems and infrastructure",
    description:
      "Long-form notes for operators, architects, and founders who still care about how the machine actually works.",
  },
  {
    label: "02",
    title: "Data, signal, and monitoring",
    description:
      "Use the template for market intelligence, collection pipelines, catalog products, and research-grade publication workflows.",
  },
  {
    label: "03",
    title: "Trust, defense, and community",
    description:
      "Blend editorial publishing with protected traffic, professional community spaces, and a trusted service directory.",
  },
];

const editorialBlocks = [
  {
    label: "Journal",
    title: "Flagship essays and operator notes",
    description:
      "Anchor the site with a premium reading experience for essays, teardown articles, strategic notes, and opinionated field reports.",
  },
  {
    label: "Briefings",
    title: "Short updates with strong signal",
    description:
      "Publish compact briefings for product updates, market changes, tactical lessons, and event recaps without losing editorial quality.",
  },
  {
    label: "Video",
    title: "Companion video and interview formats",
    description:
      "Pair articles with talks, interview clips, and community sessions so the brand feels consistent across written and spoken formats.",
  },
  {
    label: "Archive",
    title: "Historic knowledge and field memory",
    description:
      "Turn long experience into an asset with archive pages, timelines, and evergreen explainers that newer founders can still learn from.",
  },
];

const communitySignals = [
  "Topic-based discussions around data, growth, security, and operations.",
  "Pinned weekly threads that collect the best questions, insights, and member updates.",
  "Editorial digests that convert fast-moving chat into reusable knowledge.",
];

const directorySignals = [
  "Curated profiles for founders, studios, tools, and niche B2B services.",
  "Clear categories, trust markers, and short value statements for each member.",
  "A reusable discovery layer for partnerships, referrals, and ecosystem growth.",
];

const templateKeywords = ["Editorial", "Systems-first", "Calm", "Trusted", "Technical"];

export default function App() {
  return (
    <Block component="main" min="h-screen" bg="background" p="0" data-class="tech-blog-main">
      <Container component="section" max="w-7xl" px="4" py="8" data-class="tech-blog-shell">
        <Stack gap="12" data-class="tech-blog-layout">
          <Stack component="header" gap="6" items="start" data-class="tech-blog-hero">
            <Badge variant="outline" data-class="tech-blog-badge">
              Template • Tech Blog
            </Badge>
            <Stack gap="4" max="w-4xl" data-class="tech-blog-copy">
              <Title order={1} fontSize="5xl" data-class="tech-blog-title">
                A premium tech journal for operators, founders, and infrastructure-minded builders.
              </Title>
              <Text
                fontSize="lg"
                textColor="muted-foreground"
                lineHeight="relaxed"
                data-class="tech-blog-description"
              >
                This starter template is designed for personal brands and small tech ecosystems that
                combine articles, videos, community threads, and a trusted directory of services or
                products.
              </Text>
            </Stack>
            <Group gap="4" flex="wrap" items="center" data-class="tech-blog-actions">
              <Button size="lg" href="#journal">
                Explore journal blocks
              </Button>
              <Button variant="outline" size="lg" href="#community">
                Review community sections
              </Button>
            </Group>
          </Stack>

          <Group gap="4" flex="wrap" items="stretch" data-class="tech-blog-pillars">
            {focusTracks.map((track) => (
              <Card key={track.title} flex="1" min="w-0" data-class="tech-blog-pillar-card">
                <Stack gap="4" data-class="tech-blog-pillar-content">
                  <Text
                    fontSize="sm"
                    fontWeight="semibold"
                    textColor="primary"
                    data-class="tech-blog-pillar-label"
                  >
                    {track.label}
                  </Text>
                  <Title order={2} fontSize="xl" data-class="tech-blog-pillar-title">
                    {track.title}
                  </Title>
                  <Text
                    textColor="muted-foreground"
                    lineHeight="relaxed"
                    data-class="tech-blog-pillar-description"
                  >
                    {track.description}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Group>

          <Stack component="section" id="journal" gap="6" data-class="tech-blog-section">
            <Stack gap="2" max="w-4xl" data-class="tech-blog-section-head">
              <Badge variant="secondary" data-class="tech-blog-section-badge">
                Editorial system
              </Badge>
              <Title order={2} fontSize="3xl" data-class="tech-blog-section-title">
                Publish a clear point of view across essays, briefings, and reusable knowledge.
              </Title>
              <Text
                textColor="muted-foreground"
                lineHeight="relaxed"
                data-class="tech-blog-section-description"
              >
                The default composition is intentionally calm and premium: strong hierarchy, clean
                surfaces, reliable cards, and enough structure to support an expert voice without
                turning the site into a generic SaaS landing page.
              </Text>
            </Stack>

            <Group flex="wrap" gap="4" items="stretch" data-class="tech-blog-editorial-grid">
              {editorialBlocks.map((block) => (
                <Card key={block.title} flex="1" min="w-0" data-class="tech-blog-editorial-card">
                  <Stack gap="4" data-class="tech-blog-editorial-content">
                    <Text
                      fontSize="sm"
                      fontWeight="semibold"
                      textColor="primary"
                      data-class="tech-blog-editorial-label"
                    >
                      {block.label}
                    </Text>
                    <Title order={3} fontSize="xl" data-class="tech-blog-editorial-title">
                      {block.title}
                    </Title>
                    <Text
                      textColor="muted-foreground"
                      lineHeight="relaxed"
                      data-class="tech-blog-editorial-description"
                    >
                      {block.description}
                    </Text>
                  </Stack>
                </Card>
              ))}
            </Group>
          </Stack>

          <Stack component="section" id="community" gap="6" data-class="tech-blog-section">
            <Stack gap="2" max="w-4xl" data-class="tech-blog-section-head">
              <Badge variant="outline" data-class="tech-blog-section-badge">
                Community and directory
              </Badge>
              <Title order={2} fontSize="3xl" data-class="tech-blog-section-title">
                Extend the blog into a club, not just a publishing archive.
              </Title>
              <Text
                textColor="muted-foreground"
                lineHeight="relaxed"
                data-class="tech-blog-section-description"
              >
                A strong tech brand can combine commentary, guided discussion, and a curated catalog of
                useful people or products. That mix turns attention into a durable ecosystem.
              </Text>
            </Stack>

            <Group flex="wrap" gap="4" items="stretch" data-class="tech-blog-community-grid">
              <Card flex="1" min="w-0" data-class="tech-blog-community-card">
                <Stack gap="4" data-class="tech-blog-community-content">
                  <Title order={3} fontSize="xl" data-class="tech-blog-community-title">
                    Community layer
                  </Title>
                  {communitySignals.map((item) => (
                    <Text
                      key={item}
                      textColor="muted-foreground"
                      lineHeight="relaxed"
                      data-class="tech-blog-community-item"
                    >
                      {item}
                    </Text>
                  ))}
                </Stack>
              </Card>

              <Card flex="1" min="w-0" data-class="tech-blog-directory-card">
                <Stack gap="4" data-class="tech-blog-directory-content">
                  <Title order={3} fontSize="xl" data-class="tech-blog-directory-title">
                    Directory layer
                  </Title>
                  {directorySignals.map((item) => (
                    <Text
                      key={item}
                      textColor="muted-foreground"
                      lineHeight="relaxed"
                      data-class="tech-blog-directory-item"
                    >
                      {item}
                    </Text>
                  ))}
                </Stack>
              </Card>
            </Group>
          </Stack>

          <Card data-class="tech-blog-template-note">
            <Stack gap="4" data-class="tech-blog-template-note-content">
              <Badge variant="outline" data-class="tech-blog-template-note-badge">
                Template direction
              </Badge>
              <Title order={2} fontSize="2xl" data-class="tech-blog-template-note-title">
                Calm, editorial, system-first branding is the default posture.
              </Title>
              <Text
                textColor="muted-foreground"
                lineHeight="relaxed"
                data-class="tech-blog-template-note-description"
              >
                The Maxim Kulgin-specific brief, brand references, and future token mapping live under
                `.maxim-kulgin`. This template stays generic so other technical founders, operators, and
                specialist teams can adapt it to their own brand.
              </Text>
              <Group gap="2" flex="wrap" items="center" data-class="tech-blog-template-note-tags">
                {templateKeywords.map((item) => (
                  <Badge key={item} variant="secondary" data-class="tech-blog-template-note-tag">
                    {item}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        </Stack>
      </Container>
    </Block>
  );
}

