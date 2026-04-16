import { Box, Container, Flex, Heading, Text, VStack, SimpleGrid, Badge, Link } from '@chakra-ui/react';

const projects = [
  {
    title: 'NexusLink',
    description: 'URL Shortener focado em Clean Architecture, Redis e Workers asíncronos.',
    techs: ['Golang', 'RabbitMQ', 'Redis', 'PostgreSQL'],
    demoUrl: 'https://github.com/leonardo-gorska/nexuslink',
    color: 'teal'
  },
  {
    title: 'MedAgenda',
    description: 'API corporativa para gestão médica com perfis restritivos e JWT.',
    techs: ['Java', 'Spring Boot', 'PostgreSQL'],
    demoUrl: 'https://github.com/leonardo-gorska/med-agenda',
    color: 'green'
  },
  {
    title: 'GorvaxCore',
    description: 'Massivo Plugin Minecraft (+10k linhas) com IA de Bosses e Economia Dinâmica.',
    techs: ['Java 21', 'Paper API', 'Gradle', 'SQLite'],
    demoUrl: 'https://github.com/leonardo-gorska/gorvax-plugin',
    color: 'orange'
  },
  {
    title: 'LogiTrack API',
    description: 'Engine de backend para logística usando Python assíncrono.',
    techs: ['Python', 'FastAPI', 'Docker'],
    demoUrl: 'https://github.com/leonardo-gorska/logitrack-api',
    color: 'blue'
  },
  {
    title: 'FinTrack',
    description: 'Data-visualization em tempo real de transações e saldo.',
    techs: ['React 19', 'TypeScript', 'Chakra UI', 'Recharts'],
    demoUrl: 'https://leonardo-gorska.github.io/fintrack',
    color: 'purple'
  },
  {
    title: 'AI Game Factory',
    description: 'Pipeline LLM multitarefa (9 agentes) planejando e criando jogos.',
    techs: ['Python', 'Next.js', 'LLMs'],
    demoUrl: 'https://github.com/leonardo-gorska/ai-game-factory',
    color: 'orange'
  },
  {
    title: 'Gorvax Price Bot',
    description: 'Bot rastreador de preços via web scraping stealth em 6 lojas BR.',
    techs: ['TypeScript', 'Node.js', 'Puppeteer', 'SQLite'],
    demoUrl: 'https://github.com/leonardo-gorska/gorvax-price-bot',
    color: 'cyan'
  },
  {
    title: 'DevBlog',
    description: 'Plataforma de postagens técnicas e arquitetura otimizada para SEO.',
    techs: ['Next.js 15', 'React', 'Markdown'],
    demoUrl: 'https://leonardo-gorska.github.io/dev-blog',
    color: 'gray'
  },
  {
    title: 'PyAnalytics CLI',
    description: 'Ferramenta via terminal para análise e exportação de dados analíticos.',
    techs: ['Python 3.12', 'Pandas', 'Matplotlib'],
    demoUrl: 'https://github.com/leonardo-gorska/pyanalytics',
    color: 'yellow'
  },
  {
    title: 'Gestão de Projetos A3',
    description: 'Sistema Desktop para tracking acadêmico e relatórios gerenciais.',
    techs: ['Java', 'JavaFX', 'MySQL'],
    demoUrl: 'https://github.com/leonardo-gorska/gestao-projetos',
    color: 'red'
  },
  {
    title: 'Auto-DevRel',
    description: 'Automação de engenharia e mock de tráfego orgânico via CLI.',
    techs: ['Python', 'Git Automation', 'Bash'],
    demoUrl: 'https://github.com/leonardo-gorska/auto-devrel',
    color: 'purple'
  },
  {
    title: 'Schematic Studio',
    description: 'Desenvolvimento programático e algoritmos 3D via Perlin Noise.',
    techs: ['Python', 'Numpy', '3D Math'],
    demoUrl: 'https://github.com/leonardo-gorska/gorvax-schematics',
    color: 'blue'
  },
  {
    title: 'OCI Instance Bot',
    description: 'Serviço em nuvem (SystemD) gerenciando conexões com Cloud Oracle.',
    techs: ['Python', 'Cloud / OCI', 'Linux'],
    demoUrl: 'https://github.com/leonardo-gorska/oci-bot',
    color: 'red'
  },
  {
    title: 'Gorvax Auto Accept',
    description: 'Extensão VS Code rodando um daemon de automação interna.',
    techs: ['TypeScript', 'VS Code API', 'Extension'],
    demoUrl: 'https://github.com/leonardo-gorska/husk-auto-accept',
    color: 'cyan'
  },
  {
    title: 'GorvaxMC Manual',
    description: 'Design system medieval para E-book interativo (HTML/CSS Vanilla).',
    techs: ['HTML5', 'CSS3', 'JS'],
    demoUrl: 'https://leonardo-gorska.github.io/gorvaxmc-manual',
    color: 'orange'
  }
];

export default function App() {
  return (
    <Box minH="100vh" bg="gray.900" color="white" pt={20} pb={20}>
      <Container maxW="container.xl">
        <VStack gap={10} align="flex-start">
          
          {/* O Hero */}
          <VStack align="flex-start" gap={4} maxW="800px">
            <Badge colorPalette="blue" size="lg" px={3} py={1} borderRadius="full">
              Open to Work • Estágio / Júnior
            </Badge>
            <Heading size="4xl" fontWeight="900" letterSpacing="tight" mt={4}>
              Engenharia de Software robusta,<br/> desde o Server até a Tela.
            </Heading>
            <Text fontSize="xl" color="gray.400" lineHeight="tall">
              Oi, eu sou o <b>Leonardo Gorska</b>. Desenvolvedor Full-Stack focado em 
              Clean Architecture, Mensageria (RabbitMQ) e performance. Construo APIs impenetráveis em Golang e Spring Boot, 
              e trago dashboards em React à vida.
            </Text>
            <Flex gap={4} mt={6}>
              <Link href="https://github.com/leonardo-gorska" target="_blank" bg="white" color="black" px={6} py={3} borderRadius="md" fontWeight="bold" _hover={{ bg: "gray.200" }} textDecoration="none">
                Ver GitHub
              </Link>
              <Link href="https://linkedin.com/in/leonardo-gorska" target="_blank" bg="transparent" border="1px solid" borderColor="gray.600" color="white" px={6} py={3} borderRadius="md" fontWeight="bold" _hover={{ bg: "gray.800" }} textDecoration="none">
                LinkedIn
              </Link>
            </Flex>
          </VStack>

          {/* O Arsenal */}
          <Box w="full" mt={16}>
            <Heading size="xl" mb={8} color="white">Meu Arsenal Principal</Heading>
            <Flex flexWrap="wrap" gap={3}>
              {['Golang', 'Java (Spring Boot)', 'Python (FastAPI)', 'React 19', 'TypeScript', 'PostgreSQL', 'RabbitMQ', 'Redis', 'Docker', 'CI/CD'].map((skill) => (
                <Badge key={skill} variant="subtle" color="gray.300" bg="gray.800" fontSize="md" px={4} py={2} borderRadius="md" border="1px solid" borderColor="gray.700">
                  {skill}
                </Badge>
              ))}
            </Flex>
          </Box>

          {/* Projetos em Destaque */}
          <Box w="full" mt={16}>
            <Heading size="xl" mb={8} color="white">Showcase Operacional</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap={8}>
              {projects.map((proj) => (
                <Box key={proj.title} bg="gray.800" p={8} borderRadius="xl" border="1px solid" borderColor="gray.700" transition="all 0.2s" _hover={{ transform: 'translateY(-5px)', borderColor: 'blue.400' }}>
                  <Heading size="lg" color="white" mb={3}>{proj.title}</Heading>
                  <Text color="gray.400" mb={6} minH="48px">{proj.description}</Text>
                  <Flex flexWrap="wrap" gap={2} mb={6}>
                    {proj.techs.map((tech) => (
                      <Badge key={tech} colorPalette={proj.color} size="sm">{tech}</Badge>
                    ))}
                  </Flex>
                  <Link href={proj.demoUrl} target="_blank" color="blue.400" fontWeight="bold" _hover={{ color: "blue.300", textDecoration: "underline" }}>
                    Ver Código / Live Demo →
                  </Link>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}
