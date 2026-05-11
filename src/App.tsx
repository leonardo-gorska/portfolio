import { Box, Container, Flex, Heading, Text, VStack, SimpleGrid, Badge, Link } from '@chakra-ui/react';
import ParticleField from './components/ParticleField';

const projects = [
  {
    title: 'NexusLink',
    description: 'Engine de encurtamento e rastreamento de URLs com processamento assíncrono e Event-Driven Architecture.',
    techs: ['Golang', 'RabbitMQ', 'Redis', 'PostgreSQL'],
    demoUrl: 'https://github.com/leonardo-gorska/nexuslink',
    color: 'teal',
    isLive: false
  },
  {
    title: 'MedAgenda',
    description: 'API REST de agendamento médico com validação anti-overlap, JWT Stateless e OpenAPI docs.',
    techs: ['Java 21', 'Spring Boot 3', 'Flyway', 'PostgreSQL'],
    demoUrl: 'https://github.com/leonardo-gorska/med-agenda',
    color: 'green',
    isLive: false
  },
  {
    title: 'FinTrack',
    description: 'Dashboard financeiro interativo com gráficos em tempo real, dark mode e exportação CSV.',
    techs: ['React 19', 'TypeScript', 'Chakra UI v3', 'Recharts'],
    demoUrl: 'https://fintrack-rust-two.vercel.app',
    color: 'purple',
    isLive: true
  },
  {
    title: 'LogiTrack API',
    description: 'API corporativa ultrarrápida para gestão logística com processamento assíncrono ASGI.',
    techs: ['Python 3.12', 'FastAPI', 'Docker', 'SQLAlchemy'],
    demoUrl: 'https://github.com/leonardo-gorska/logitrack-api',
    color: 'blue',
    isLive: false
  },
  {
    title: 'DevBlog',
    description: 'Blog técnico sobre engenharia de software com SSR, SEO otimizado e arquitetura híbrida.',
    techs: ['Next.js 15', 'React', 'MDX', 'Vercel'],
    demoUrl: 'https://dev-blog-ten-rho.vercel.app',
    color: 'gray',
    isLive: true
  },
  {
    title: 'GorvaxCore',
    description: 'Plugin Minecraft massivo (+10k linhas, 880 testes) com IA de Bosses e economia dinâmica.',
    techs: ['Java 21', 'Paper API', 'Gradle', 'JUnit 5'],
    demoUrl: 'https://github.com/leonardo-gorska/gorvax-plugin',
    color: 'orange',
    isLive: false
  },
  {
    title: 'Gorvax Price Bot',
    description: 'Bot Telegram de rastreamento de preços em 6 lojas brasileiras com web scraping stealth.',
    techs: ['TypeScript', 'Node.js', 'Puppeteer', 'SQLite'],
    demoUrl: 'https://github.com/leonardo-gorska/gorvax-price-bot',
    color: 'cyan',
    isLive: false
  },
  {
    title: 'AI Game Factory',
    description: 'Pipeline autônomo com 9 agentes de IA que criam e evoluem jogos de navegador.',
    techs: ['Python', 'Next.js', 'LLMs', 'Quality Engine'],
    demoUrl: 'https://github.com/leonardo-gorska/ai-game-factory',
    color: 'orange',
    isLive: false
  }
];

export default function App() {
  return (
    <Box minH="100vh" bg="gray.900" color="white" pt={20} pb={20} position="relative" overflow="hidden">
      <ParticleField />
      <Container maxW="container.xl" position="relative" zIndex={2}>
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
              Oi, sou <b>Leonardo Gorska</b>. Desenvolvedor Full-Stack focado em Engenharia de Software Moderna.
              <br/><br/>
              <b>Back-end:</b> Experiência no desenvolvimento de APIs robustas e escaláveis em Golang, Spring Boot e Python. Na construção de cada projeto utilizei Clean Architecture e sistemas distribuídos com mensageria (RabbitMQ).
              <br/><br/>
              <b>Front-end:</b> Interfaces reativas utilizando React e TypeScript.
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
                  <Link href={proj.demoUrl} target="_blank" color={proj.isLive ? "green.400" : "blue.400"} fontWeight="bold" _hover={{ color: proj.isLive ? "green.300" : "blue.300", textDecoration: "underline" }}>
                    {proj.isLive ? '🟢 Live Demo →' : 'Ver Código →'}
                  </Link>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Contato */}
          <Box w="full" mt={16} py={12} borderTop="1px solid" borderColor="gray.700">
            <VStack gap={4} align="center">
              <Heading size="xl" color="white">Vamos Conversar?</Heading>
              <Text color="gray.400" fontSize="lg" textAlign="center" maxW="600px">
                Estou em busca de oportunidades como Estagiário ou Desenvolvedor Júnior. 
                Entre em contato por email ou LinkedIn.
              </Text>
              <Flex gap={4} mt={4}>
                <Link href="mailto:leogorska22@hotmail.com" target="_blank" bg="blue.500" color="white" px={6} py={3} borderRadius="md" fontWeight="bold" _hover={{ bg: "blue.400" }} textDecoration="none">
                  📧 Email
                </Link>
                <Link href="https://linkedin.com/in/leonardo-gorska" target="_blank" bg="transparent" border="1px solid" borderColor="blue.500" color="blue.400" px={6} py={3} borderRadius="md" fontWeight="bold" _hover={{ bg: "blue.900" }} textDecoration="none">
                  💼 LinkedIn
                </Link>
              </Flex>
            </VStack>
          </Box>

        </VStack>
      </Container>
    </Box>
  );
}
