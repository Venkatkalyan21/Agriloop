import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data - Replace with API call in production
const mockListings = [
  {
    id: 1,
    title: 'Organic Tomato Waste',
    description: 'High-quality organic waste from tomato processing.',
    category: 'Vegetables',
    quantity: '500 kg',
    price: '₹5.00 per kg',
    location: 'Nashik, Maharashtra',
    createdAt: '2023-10-15',
    status: 'active',
    views: 45,
    inquiries: 3,
    image: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 2,
    name: 'Rice Husks',
    title: 'Rice Husks',
    description: 'Dry rice husks suitable for biomass energy.',
    category: 'Grains & Cereals',
    quantity: '2000 kg',
    price: '₹8.00 per kg',
    location: 'Vijayawada, Andhra Pradesh',
    createdAt: '2023-10-10',
    status: 'active',
    views: 32,
    inquiries: 1,
    image: 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 3,
    name: 'Cow Manure Compost',
    title: 'Cow Manure Compost',
    description: 'Fully composted cow manure, ready for field application.',
    category: 'Animal Waste',
    quantity: '1000 kg',
    price: '₹2.50 per kg',
    location: 'Anand, Gujarat',
    createdAt: '2023-09-28',
    status: 'sold',
    views: 128,
    inquiries: 8,
    image: 'https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 4,
    name: 'Wood Sawdust',
    title: 'Wood Sawdust',
    description: 'Clean sawdust from timber processing.',
    category: 'Biomass',
    quantity: '300 kg',
    price: '₹4.00 per kg',
    location: 'Stockholm, Sweden',
    createdAt: '2023-01-20',
    status: 'sold',
    views: 215,
    inquiries: 12
  }
];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  line-height: 1.6;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background.paper};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
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

const ListingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ListingCard = styled(motion.div) <{ status: string }>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  border-top: 5px solid ${({ status, theme }) =>
    status === 'active' ? theme.colors.success :
      status === 'pending' ? theme.colors.warning :
        status === 'sold' ? theme.colors.info :
          theme.colors.primary.main
  };
`;

const ListingHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ListingTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const ListingCategory = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ status, theme }) =>
    status === 'active' ? `${theme.colors.success}20` :
      status === 'pending' ? `${theme.colors.warning}20` :
        status === 'sold' ? `${theme.colors.info}20` :
          theme.colors.primary.light
  };
  color: ${({ status, theme }) =>
    status === 'active' ? theme.colors.success :
      status === 'pending' ? theme.colors.warning :
        status === 'sold' ? theme.colors.info :
          theme.colors.primary.main
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-transform: capitalize;
`;

const ListingContent = styled.div`
  padding: 1.5rem;
`;

const ListingDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ListingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ListingFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  background-color: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.primary.main :
      variant === 'secondary' ? 'transparent' :
        theme.colors.error
  };
  color: ${({ variant, theme }) =>
    variant === 'secondary' ? theme.colors.primary.main : 'white'
  };
  border: ${({ variant, theme }) =>
    variant === 'secondary' ? `1px solid ${theme.colors.primary.main}` : 'none'
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  flex: 1;
  
  &:hover {
    background-color: ${({ variant, theme }) =>
    variant === 'primary' ? theme.colors.primary.dark :
      variant === 'secondary' ? `${theme.colors.primary.light}20` :
        theme.colors.error
  };
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [listings, setListings] = useState<any[]>([]);

  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login?redirect=/my-listings');
  }

  // Load listings from localStorage on component mount
  useEffect(() => {
    const storedListings = localStorage.getItem('agriloopListings');
    if (storedListings) {
      setListings(JSON.parse(storedListings));
    } else {
      // If no listings in localStorage, use mock data as fallback
      setListings(mockListings);
      // Store mock data in localStorage
      localStorage.setItem('agriloopListings', JSON.stringify(mockListings));
    }
  }, []);

  // Filter listings based on status
  const filteredListings = statusFilter === 'all'
    ? listings
    : listings.filter(listing => listing.status === statusFilter);

  // Handle creating a new listing
  const handleCreateListing = () => {
    navigate('/create-listing');
  };

  // Handle editing a listing
  const handleEditListing = (id: number) => {
    navigate(`/edit-listing/${id}`);
  };

  // Handle deleting a listing
  const handleDeleteListing = (id: number) => {
    const listing = listings.find(item => item.id === id);
    if (listing && window.confirm(`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`)) {
      const updatedListings = listings.filter(listing => listing.id !== id);
      setListings(updatedListings);

      // Update localStorage
      localStorage.setItem('agriloopListings', JSON.stringify(updatedListings));

      // Show confirmation to user
      alert('Listing has been deleted successfully.');
    }
  };

  // Handle marking a listing as sold
  const handleMarkAsSold = (id: number) => {
    if (window.confirm('Are you sure you want to mark this listing as sold? This cannot be undone.')) {
      const updatedListings = listings.map(listing =>
        listing.id === id ? { ...listing, status: 'sold' } : listing
      );

      setListings(updatedListings);

      // Update localStorage
      localStorage.setItem('agriloopListings', JSON.stringify(updatedListings));

      // Show confirmation to user
      alert('Listing has been marked as sold.');
    }
  };

  return (
    <PageContainer>
      <PageHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>My Material Listings</Title>
          <Subtitle>
            Manage your active, pending, and sold material listings. Create new listings or update existing ones.
          </Subtitle>
        </motion.div>
      </PageHeader>

      <ActionsBar>
        <FiltersContainer>
          <FilterSelect
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Listings</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </FilterSelect>
        </FiltersContainer>

        <Button onClick={handleCreateListing}>Create New Listing</Button>
      </ActionsBar>

      {filteredListings.length > 0 ? (
        <ListingGrid>
          {filteredListings.map((listing, index) => (
            <ListingCard
              key={listing.id}
              status={listing.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ListingHeader>
                <div>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingCategory>
                    {listing.category} &gt; {listing.subcategory}
                  </ListingCategory>
                </div>
                <StatusBadge status={listing.status}>
                  {listing.status}
                </StatusBadge>
              </ListingHeader>

              <ListingContent>
                <ListingDescription>{listing.description}</ListingDescription>

                <ListingDetails>
                  <DetailItem>
                    <DetailLabel>Quantity</DetailLabel>
                    <DetailValue>{listing.quantity}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Price</DetailLabel>
                    <DetailValue>{listing.price}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Location</DetailLabel>
                    <DetailValue>{listing.location}</DetailValue>
                  </DetailItem>

                  <DetailItem>
                    <DetailLabel>Date Listed</DetailLabel>
                    <DetailValue>{listing.createdAt}</DetailValue>
                  </DetailItem>
                </ListingDetails>

                <ButtonsContainer>
                  <ActionButton
                    variant="primary"
                    onClick={() => navigate(`/marketplace/${listing.id}`)}
                  >
                    View
                  </ActionButton>

                  <ActionButton
                    variant="secondary"
                    onClick={() => handleEditListing(listing.id)}
                  >
                    Edit
                  </ActionButton>

                  {listing.status === 'active' && (
                    <ActionButton
                      variant="secondary"
                      onClick={() => handleMarkAsSold(listing.id)}
                    >
                      Mark Sold
                    </ActionButton>
                  )}

                  <ActionButton
                    variant="danger"
                    onClick={() => handleDeleteListing(listing.id)}
                  >
                    Delete
                  </ActionButton>
                </ButtonsContainer>
              </ListingContent>

              <ListingFooter>
                <FooterItem>{listing.views} views</FooterItem>
                <FooterItem>{listing.inquiries} inquiries</FooterItem>
              </ListingFooter>
            </ListingCard>
          ))}
        </ListingGrid>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No listings found</EmptyStateTitle>
          <EmptyStateText>
            {statusFilter === 'all'
              ? "You haven't created any material listings yet. Get started by creating your first listing to showcase your available waste."
              : `You don't have any ${statusFilter} listings at the moment.`}
          </EmptyStateText>
          <Button onClick={handleCreateListing}>Create Your First Listing</Button>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default MyListingsPage; 