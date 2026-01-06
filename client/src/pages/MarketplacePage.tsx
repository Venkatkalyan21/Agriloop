import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';

// Mock data - Replace with API call in production
const mockMaterials = [
  {
    id: 1,
    name: 'Organic Tomato Waste',
    category: 'Vegetables',
    quantity: '500 kg',
    location: 'Hamburg, Germany',
    price: '₹5.00/kg',
    image: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Fresh tomato waste suitable for composting or biogas production.'
  },
  {
    id: 2,
    name: 'Wheat Straw Bales',
    category: 'Grains & Cereals',
    quantity: '2000 kg',
    location: 'Punjab, India',
    price: '₹8.00/kg',
    image: 'https://images.pexels.com/photos/1600139/pexels-photo-1600139.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Dry wheat straw, perfect for animal bedding or mushroom cultivation.'
  },
  {
    id: 3,
    name: 'Apple Pomace',
    category: 'Processed Waste',
    quantity: '300 kg',
    location: 'Himachal Pradesh, India',
    price: '₹3.00/kg',
    image: 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Leftover pulp from apple juice production, high in fiber.'
  },
  {
    id: 4,
    name: 'Rice Husks',
    category: 'Grains & Cereals',
    quantity: '1500 kg',
    location: 'Andhra Pradesh, India',
    price: '₹6.00/kg',
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Rice husks suitable for biomass energy or insulation material.'
  },
  {
    id: 5,
    name: 'Wood Chips',
    category: 'Biomass',
    quantity: '1000 kg',
    location: 'Kerala, India',
    price: '₹10.00/kg',
    image: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Clean wood chips from forestry operations, ideal for mulch or fuel.'
  },
  {
    id: 6,
    name: 'Cow Manure',
    category: 'Animal Waste',
    quantity: '5000 kg',
    location: 'Gujarat, India',
    price: '₹2.00/kg',
    image: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Composted cow manure, excellent organic fertilizer.'
  },
];

const categories = ['All', 'Vegetables', 'Fruits', 'Grains & Cereals', 'Biomass', 'Animal Waste', 'Processed Waste'];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 1rem;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  align-items: center;
`;

const FilterLabel = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const CategoryButton = styled.button<{ isActive: boolean }>`
  padding: 0.5rem 1rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.main : theme.colors.background.paper};
  color: ${({ isActive, theme }) =>
    isActive ? theme.colors.white : theme.colors.text.primary};
  font-weight: ${({ isActive, theme }) =>
    isActive ? theme.typography.fontWeights.medium : theme.typography.fontWeights.regular};
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  
  &:hover {
    background-color: ${({ isActive, theme }) =>
    isActive ? theme.colors.primary.dark : theme.colors.primary.light};
    color: ${({ theme }) => theme.colors.white};
  }
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.light}40;
  }
`;

const MaterialsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

// Fallback images if the real images don't load - using Pexels for more reliable loading
const materialFallbackImages = {
  'Vegetables': 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Fruits': 'https://images.pexels.com/photos/1510392/pexels-photo-1510392.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Grains & Cereals': 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Biomass': 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Animal Waste': 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Processed Waste': 'https://images.pexels.com/photos/5864250/pexels-photo-5864250.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Default': 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const MaterialCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const MaterialImage = styled.img`
  width: 100%;
  height: 180px;
  object-fit: cover;
  background-color: #f0f0f0; /* Light gray background for image placeholders */
  display: block; /* Ensures no extra space below the image */
  border-top-left-radius: ${({ theme }) => theme.borderRadius.lg};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const MaterialContent = styled.div`
  padding: 1.5rem;
`;

const MaterialName = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: 0.5rem;
`;

const MaterialCategory = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary.light}30;
  color: ${({ theme }) => theme.colors.primary.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const MaterialDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const MaterialDetail = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  display: flex;
  align-items: center;
  
  strong {
    color: ${({ theme }) => theme.colors.text.primary};
    margin-right: 0.5rem;
  }
`;

const ViewButton = styled(Link)`
  display: block;
  text-align: center;
  padding: 0.75rem 1rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-decoration: none;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const NoResults = styled.div`
  text-align: center;
  padding: 3rem;
  grid-column: 1 / -1;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: 1.2rem;
`;

const MarketplacePage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [materials, setMaterials] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<{ [key: number]: boolean }>({});

  // Handle image loading errors
  const handleImageError = (materialId: number, category: string) => {
    setImageErrors(prev => ({ ...prev, [materialId]: true }));
  };

  // Function to get correct image source
  const getImageSource = (material: any) => {
    if (imageErrors[material.id] || !material.image) {
      return materialFallbackImages[material.category as keyof typeof materialFallbackImages] ||
        materialFallbackImages.Default;
    }
    return material.image;
  };

  // Fetch listings from API
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        // Using relative path assuming proxy is set up in vite.config.ts, otherwise might need full URL
        const response = await fetch('http://localhost:4000/api/listings');
        if (!response.ok) {
          throw new Error('Failed to fetch listings');
        }
        const data = await response.json();
        setMaterials(data);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching listings:', err);
        setError('Failed to load marketplace listings. Please try again later.');
        // Fallback to empty list or mock data if critical
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  // Filter listings based on category and search query
  const filteredMaterials = materials.filter(material => {
    const matchesCategory = selectedCategory === 'All' || material.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      material.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      material.description?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <PageContainer>
      <Header>
        <Title>Marketplace</Title>
      </Header>

      <FilterSection>
        <FilterLabel>Categories:</FilterLabel>
        {categories.map(category => (
          <CategoryButton
            key={category}
            isActive={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
      </FilterSection>

      <FilterSection>
        <SearchInput
          type="text"
          placeholder="Search materials..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </FilterSection>

      <MaterialsGrid>
        {filteredMaterials.length > 0 ? (
          filteredMaterials.map(material => (
            <MaterialCard
              key={material.id}
              whileHover={{ y: -5 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <MaterialImage
                src={getImageSource(material)}
                alt={material.name}
                onError={() => handleImageError(material.id, material.category)}
              />
              <MaterialContent>
                <MaterialCategory>{material.category}</MaterialCategory>
                <MaterialName>{material.name}</MaterialName>
                <MaterialDetails>
                  <MaterialDetail><strong>Quantity:</strong> {material.quantity}</MaterialDetail>
                  <MaterialDetail><strong>Price:</strong> {material.price}</MaterialDetail>
                  <MaterialDetail><strong>Location:</strong> {material.location}</MaterialDetail>
                </MaterialDetails>
                <ViewButton to={`/marketplace/${material.id}`}>View Details</ViewButton>
              </MaterialContent>
            </MaterialCard>
          ))
        ) : (
          <NoResults>No materials found. Try adjusting your filters.</NoResults>
        )}
      </MaterialsGrid>
    </PageContainer>
  );
};

export default MarketplacePage; 