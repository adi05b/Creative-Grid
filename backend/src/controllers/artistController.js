const axios = require('axios');
const getArtsyToken = require('../utils/artsyTokenManager');

const searchArtists = async (req, res) => {
  try {
    const { q } = req.query;
    console.log("Backend: Searching for artists with query:", q);
    
    if (!q) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const token = await getArtsyToken();
    console.log("Got Artsy token:", token ? "Yes" : "No");

    const response = await axios.get('https://api.artsy.net/api/search', {
      params: { q, type: 'artist' },
      headers: { 'X-Xapp-Token': token }
    });
    
    const artists = response.data._embedded.results.map(result => {
      const selfLink = result._links.self.href;
      const id = selfLink.split('/').pop();
      return {
        id: id,
        name: result.title,
        thumbnail: result._links.thumbnail?.href || '/assets/shared/missing_image.png',
        nationality: result.nationality,
        birthday: result.birthday
      };
    });

    console.log("Sending artists to frontend:", artists.length);
    res.json(artists);
  } catch (error) {
    console.error('Artsy Search Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to search artists' });
  }
};

const getArtistDetails = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Backend: Fetching details for artist ID:", id);
    
    if (!id) {
      return res.status(400).json({ error: 'Artist ID is required' });
    }

    const token = await getArtsyToken();
    console.log("Got Artsy token:", token ? "Yes" : "No");

    const response = await axios.get(`https://api.artsy.net/api/artists/${id}`, {
      headers: { 'X-Xapp-Token': token }
    });
    
    const artist = {
      id: response.data.id,
      name: response.data.name,
      birthday: response.data.birthday,
      deathday: response.data.deathday,
      nationality: response.data.nationality,
      biography: response.data.biography,
      image: response.data._links.thumbnail?.href || '/assets/shared/missing_image.png',
      thumbnail: response.data._links.thumbnail?.href || '/assets/shared/missing_image.png'
    };

    console.log("Sending artist details to frontend:", artist.name);
    res.json(artist);
  } catch (error) {
    console.error('Artist Details Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get artist details' });
  }
};

const getArtistArtworks = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Backend: Fetching artworks for artist ID:", id);
    
    if (!id) {
      return res.status(400).json({ error: 'Artist ID is required' });
    }

    const token = await getArtsyToken();
    console.log("Got Artsy token:", token ? "Yes" : "No");

    // First get the artist details to find the artworks link
    const artistResponse = await axios.get(`https://api.artsy.net/api/artists/${id}`, {
      headers: { 'X-Xapp-Token': token }
    });
    
    if (!artistResponse.data._links.artworks) {
      console.log("No artworks link found for this artist");
      return res.json([]);
    }
    
    const artworksUrl = artistResponse.data._links.artworks.href;
    console.log("Artworks URL:", artworksUrl);
    
    const artworksResponse = await axios.get(artworksUrl, {
      headers: { 'X-Xapp-Token': token }
    });
    
    if (!artworksResponse.data._embedded || !artworksResponse.data._embedded.artworks) {
      console.log("No artworks found in the response");
      return res.json([]);
    }

    const artworks = artworksResponse.data._embedded.artworks.map(artwork => ({
      id: artwork.id,
      title: artwork.title,
      date: artwork.date,
      image: artwork._links.thumbnail?.href || '/assets/shared/missing_image.png',
      categories: artwork.category
    }));

    console.log("Sending artworks to frontend:", artworks.length);
    res.json(artworks);
  } catch (error) {
    console.error('Artist Artworks Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get artist artworks' });
  }
};

const getArtworkCategories = async (req, res) => {
  try {
    const { artworkId } = req.params;
    console.log("Backend: Fetching categories for artwork ID:", artworkId);
    
    if (!artworkId) {
      return res.status(400).json({ error: 'Artwork ID is required' });
    }

    const token = await getArtsyToken();
    console.log("Got Artsy token:", token ? "Yes" : "No");
    
    const response = await axios.get('https://api.artsy.net/api/genes', {
      params: { artwork_id: artworkId },
      headers: { 'X-Xapp-Token': token }
    });
    
    if (!response.data._embedded || !response.data._embedded.genes) {
      console.log("No genes found in the response");
      return res.json([]);
    }
    
    const categories = response.data._embedded.genes.map(gene => ({
      id: gene.id,
      name: gene.name,
      thumbnail: gene._links.thumbnail?.href || '/assets/shared/missing_image.png',
      description: gene.description || "" // Include description from API if available, otherwise empty string
    }));
    
    console.log("Sending categories to frontend:", categories.length);
    res.json(categories);
  } catch (error) {
    console.error('Artwork Categories Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get artwork categories' });
  }
};

const getSimilarArtists = async (req, res) => {
  try {
    const { artistId } = req.params;
    console.log("Backend: Fetching similar artists for artist ID:", artistId);
    
    if (!artistId) {
      return res.status(400).json({ error: 'Artist ID is required' });
    }

    const token = await getArtsyToken();
    
    const response = await axios.get('https://api.artsy.net/api/artists', {
      params: { similar_to_artist_id: artistId },
      headers: { 'X-Xapp-Token': token }
    });
    
    if (!response.data._embedded || !response.data._embedded.artists) {
      return res.json([]);
    }
    
    const similarArtists = response.data._embedded.artists.map(artist => ({
      id: artist.id,
      name: artist.name,
      thumbnail: artist._links.thumbnail?.href || '/assets/shared/missing_image.png'
    }));
    
    res.json(similarArtists);
  } catch (error) {
    console.error('Similar Artists Error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get similar artists' });
  }
};

module.exports = { 
  searchArtists, 
  getArtistDetails, 
  getArtistArtworks,
  getArtworkCategories,
  getSimilarArtists
};