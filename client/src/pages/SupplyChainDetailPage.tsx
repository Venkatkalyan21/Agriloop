import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data - would be fetched from API in production
const mockSupplyChains = [
  {
    id: 1,
    name: 'Biogas Production Loop',
    description: 'Closed-loop supply chain for turning vegetable and animal waste into biogas.',
    longDescription: 'Our Biogas Production Loop connects farmers, food processors, and biogas plants to transform organic waste into renewable energy. We facilitate the collection of crop residues and manure, ensuring they are efficiently transported to anaerobic digesters for clean energy production.',
    participants: 10,
    companies: [
      { id: 1, name: 'FarmFresh Co', role: 'Waste Producer' },
      { id: 2, name: 'GreenEnergy Logistics', role: 'Collection & Transport' },
      { id: 3, name: 'BioPower Plants', role: 'Energy Production' },
      { id: 4, name: 'EcoFertilizers', role: 'Digestate Processing' },
      { id: 5, name: 'GridConnect', role: 'Distribution' }
    ],
    materials: ['Vegetable Waste', 'Manure', 'Crop Residues'],
    carbonSaved: '3,000 tons CO2e',
    wasteRecycled: '5,000 tons',
    energySaved: '60,000 kWh',
    waterSaved: '5 million liters',
    status: 'active',
    createdAt: '2023-03-10',
    admin: 'BioPower Plants',
    location: 'Central Europe',
    certifications: ['ISO 14001', 'Biogas Certified'],
    nextMeeting: '2025-06-15'
  },
  {
    id: 2,
    name: 'Organic Compost Network',
    description: 'Collaborative network for composting agricultural and municipal green waste.',
    longDescription: 'The Organic Compost Network links waste producers with composting facilities to create high-quality organic fertilizer. By diverting organic waste from landfills, we reduce methane emissions and produce a valuable resource for soil regeneration.',
    participants: 15,
    companies: [
      { id: 6, name: 'CityGreens', role: 'Collection' },
      { id: 7, name: 'SoilRegen Composters', role: 'Processing' },
      { id: 8, name: 'AgriFarms', role: 'End User' },
      { id: 9, name: 'EcoGardens', role: 'Retailer' }
    ],
    materials: ['Green Waste', 'Leaves', 'Grass Clippings'],
    carbonSaved: '1,500 tons CO2e',
    wasteRecycled: '2,500 tons',
    energySaved: 'N/A',
    waterSaved: '2 million liters',
    status: 'active',
    createdAt: '2023-04-20',
    admin: 'SoilRegen Composters',
    location: 'Regional',
    certifications: ['Certified Organic Input', 'Compost Quality Seal'],
    nextMeeting: '2025-06-20'
  },
  {
    id: 3,
    name: 'Animal Feed Exchange',
    description: 'System for upcycling safe food by-products into animal feed.',
    longDescription: 'Our Animal Feed Exchange connects food manufacturers with feed producers to turn safe by-products like brewers grains, fruit pulp, and bakery waste into nutritious animal feed components, reducing food waste and supporting local livestock farming.',
    participants: 8,
    companies: [
      { id: 10, name: 'BrewMasters', role: 'By-product Generator' },
      { id: 11, name: 'FeedTech Solutions', role: 'Processing' },
      { id: 12, name: 'Livestock Feeds', role: 'Manufacturing' },
      { id: 13, name: 'HappyCows Farm', role: 'End User' }
    ],
    materials: ['Spent Grains', 'Fruit Pulp', 'Bakery Waste'],
    carbonSaved: '2,100 tons CO2e',
    wasteRecycled: '3,200 tons',
    energySaved: '40,000 kWh',
    waterSaved: '4 million liters',
    status: 'active',
    createdAt: '2023-02-10',
    admin: 'FeedTech Solutions',
    location: 'National',
    certifications: ['Safe Feed Standard', 'GMP+'],
    nextMeeting: '2025-06-25'
  },
  {
    id: 4,
    name: 'Bio-Plastics Initiative',
    description: 'Project to develop biodegradable plastics from agricultural residues.',
    longDescription: 'The Bio-Plastics Initiative brings together researchers, farmers, and manufacturers to produce biodegradable packaging materials from agricultural residues like corn starch and sugarcane bagasse, offering a sustainable alternative to petroleum-based plastics.',
    participants: 12,
    companies: [
      { id: 14, name: 'AgriResidue Co', role: 'Collection' },
      { id: 15, name: 'BioChem Labs', role: 'R&D' },
      { id: 16, name: 'GreenPack Manufacturing', role: 'Production' },
      { id: 17, name: 'EcoRetailers', role: 'Distribution' }
    ],
    materials: ['Corn Starch', 'Bagasse', 'Cellulose'],
    carbonSaved: '800 tons CO2e',
    wasteRecycled: '1,500 tons',
    energySaved: '20,000 kWh',
    waterSaved: '1 million liters',
    status: 'planning',
    createdAt: '2023-07-15',
    admin: 'BioChem Labs',
    location: 'Global',
    certifications: ['Biodegradable Certified', 'Compostable'],
    nextMeeting: '2025-06-10'
  }
];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.primary.main};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const TopSection = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    flex-direction: row;
    gap: 2rem;
  }
`;

const MainInfo = styled.div`
  flex: 2;
`;

const SideInfo = styled.div`
  flex: 1;
  margin-top: 2rem;
  
  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const HeaderSection = styled.div`
  margin-bottom: 1.5rem;
`;

const Name = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 0.5rem;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

const LongDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ status, theme }) =>
    status === 'active' ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ status, theme }) =>
    status === 'active' ? theme.colors.success : theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-left: 1rem;
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  margin-bottom: 2rem;
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.primary.dark};
`;

const MaterialsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
`;

const MaterialTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary.light}30;
  color: ${({ theme }) => theme.colors.primary.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
`;

const InfoItem = styled.div`
  margin-bottom: 1rem;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const InfoLabel = styled.span`
  display: block;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CompanyList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CompanyItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const CompanyName = styled.div`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  margin-bottom: 0.25rem;
`;

const CompanyRole = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Section = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: 1.5rem;
`;

const FlowDiagram = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  overflow-x: auto;
  margin-bottom: 2rem;
`;

const DiagramNode = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
`;

const NodeIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: ${({ theme }) => theme.borderRadius.circle};
  background-color: ${({ theme }) => theme.colors.primary.light};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.5rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const NodeLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const NodeConnection = styled.div`
  height: 2px;
  background-color: ${({ theme }) => theme.colors.primary.light};
  flex-grow: 1;
  margin: 0 0.5rem;
  position: relative;
  
  &::after {
    content: '→';
    position: absolute;
    top: -10px;
    right: -5px;
    color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.main};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.light}20;
  }
`;

const CertificationList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CertificationTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.info}20;
  color: ${({ theme }) => theme.colors.info};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
`;

const SupplyChainDetailPage: React.FC = () => {
  const { id } = useParams();
  const { isLoggedIn } = useAuth();
  const [chain, setChain] = useState<typeof mockSupplyChains[0] | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch the supply chain data from an API
    const chainId = parseInt(id || '0');
    const foundChain = mockSupplyChains.find(c => c.id === chainId);
    setChain(foundChain || null);
  }, [id]);

  // Handle joining the supply chain
  const handleJoinChain = () => {
    if (!isLoggedIn) {
      // Redirect to login would happen here
      alert('Please log in to join this supply chain');
      return;
    }

    setIsJoining(true);

    // Simulate API call
    setTimeout(() => {
      setIsJoining(false);
      alert(`You have requested to join the "${chain?.name}" supply chain. The administrator will review your request.`);
    }, 1000);
  };

  // Handle contacting the admin
  const handleContactAdmin = () => {
    alert(`Contact form to reach out to ${chain?.admin} will be implemented soon.`);
  };

  if (!chain) {
    return (
      <PageContainer>
        <BackButton to="/supply-chains">← Back to Supply Chains</BackButton>
        <Card>
          <CardContent>
            <p>Supply chain not found. Please check the URL and try again.</p>
          </CardContent>
        </Card>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <BackButton to="/supply-chains">← Back to Supply Chains</BackButton>

        <TopSection>
          <MainInfo>
            <HeaderSection>
              <Name>
                {chain.name}
                <StatusBadge status={chain.status}>
                  {chain.status === 'active' ? 'Active' : 'Planning Phase'}
                </StatusBadge>
              </Name>
              <Description>{chain.description}</Description>
              <LongDescription>{chain.longDescription}</LongDescription>
            </HeaderSection>

            <Card>
              <CardHeader>
                <CardTitle>Environmental Impact</CardTitle>
              </CardHeader>
              <CardContent>
                <StatsGrid>
                  <StatItem>
                    <StatLabel>Carbon Saved</StatLabel>
                    <StatValue>{chain.carbonSaved}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Waste Recycled</StatLabel>
                    <StatValue>{chain.wasteRecycled}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Energy Saved</StatLabel>
                    <StatValue>{chain.energySaved}</StatValue>
                  </StatItem>
                  <StatItem>
                    <StatLabel>Water Saved</StatLabel>
                    <StatValue>{chain.waterSaved}</StatValue>
                  </StatItem>
                </StatsGrid>
              </CardContent>
            </Card>

            <Section>
              <SectionTitle>Material Flow</SectionTitle>
              <FlowDiagram>
                <DiagramNode>
                  <NodeIcon>1</NodeIcon>
                  <NodeLabel>Collection</NodeLabel>
                </DiagramNode>

                <NodeConnection />

                <DiagramNode>
                  <NodeIcon>2</NodeIcon>
                  <NodeLabel>Sorting</NodeLabel>
                </DiagramNode>

                <NodeConnection />

                <DiagramNode>
                  <NodeIcon>3</NodeIcon>
                  <NodeLabel>Processing</NodeLabel>
                </DiagramNode>

                <NodeConnection />

                <DiagramNode>
                  <NodeIcon>4</NodeIcon>
                  <NodeLabel>Manufacturing</NodeLabel>
                </DiagramNode>

                <NodeConnection />

                <DiagramNode>
                  <NodeIcon>5</NodeIcon>
                  <NodeLabel>Distribution</NodeLabel>
                </DiagramNode>
              </FlowDiagram>
            </Section>

            <Card>
              <CardHeader>
                <CardTitle>Partner Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <CompanyList>
                  {chain.companies.map((company) => (
                    <CompanyItem key={company.id}>
                      <CompanyName>{company.name}</CompanyName>
                      <CompanyRole>{company.role}</CompanyRole>
                    </CompanyItem>
                  ))}
                </CompanyList>
              </CardContent>
            </Card>
          </MainInfo>

          <SideInfo>
            <Card>
              <CardHeader>
                <CardTitle>Supply Chain Details</CardTitle>
              </CardHeader>
              <CardContent>
                <InfoItem>
                  <InfoLabel>Materials</InfoLabel>
                  <MaterialsList>
                    {chain.materials.map((material, index) => (
                      <MaterialTag key={index}>{material}</MaterialTag>
                    ))}
                  </MaterialsList>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Administrator</InfoLabel>
                  <InfoValue>{chain.admin}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Participants</InfoLabel>
                  <InfoValue>{chain.participants} companies</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Location</InfoLabel>
                  <InfoValue>{chain.location}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Created</InfoLabel>
                  <InfoValue>{chain.createdAt}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Next Meeting</InfoLabel>
                  <InfoValue>{chain.nextMeeting}</InfoValue>
                </InfoItem>

                <InfoItem>
                  <InfoLabel>Certifications</InfoLabel>
                  <CertificationList>
                    {chain.certifications.map((cert, index) => (
                      <CertificationTag key={index}>{cert}</CertificationTag>
                    ))}
                  </CertificationList>
                </InfoItem>

                <ButtonsContainer>
                  <Button
                    onClick={handleJoinChain}
                    disabled={isJoining}
                  >
                    {isJoining ? 'Submitting...' : 'Join Supply Chain'}
                  </Button>
                  <OutlineButton onClick={handleContactAdmin}>
                    Contact Admin
                  </OutlineButton>
                </ButtonsContainer>
              </CardContent>
            </Card>
          </SideInfo>
        </TopSection>
      </motion.div>
    </PageContainer>
  );
};

export default SupplyChainDetailPage; 