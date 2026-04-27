export interface GeocodingResult {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  formattedAddress: string;
}

function pickCity(props: Record<string, any>): string {
  // Photon can return different administrative keys depending on OSM object type.
  // Prefer populated places, then municipality/county only as fallback.
  return (
    props.city ||
    props.town ||
    props.village ||
    props.hamlet ||
    props.municipality ||
    props.locality ||
    props.suburb ||
    props.district ||
    props.county ||
    props.state ||
    'Unknown City'
  );
}

function buildAddressParts(props: Record<string, any>): string[] {
  const city = pickCity(props);
  const streetLine = [props.housenumber, props.street].filter(Boolean).join(' ');
  return [
    props.name,
    streetLine || undefined,
    city,
    props.state && props.state !== city ? props.state : undefined,
    props.country
  ].filter(Boolean);
}

export async function searchPhotonAddress(query: string, limit: number = 5): Promise<GeocodingResult[]> {
  if (!query || query.trim().length < 3) return [];

  try {
    const url = `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=${limit}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();

    if (!data || !data.features) return [];

    return data.features.map((feature: any) => {
      const props = feature.properties;
      const [lng, lat] = feature.geometry.coordinates;
      
      const city = pickCity(props);
      const parts = buildAddressParts(props);

      // Unique elements only
      const formattedAddress = Array.from(new Set(parts)).join(', ');
      
      return {
        id: `${lat}-${lng}-${props.osm_id || Math.random()}`,
        name: props.name || props.street || 'Point of interest',
        city,
        state: props.state || '',
        country: props.country || 'Unknown Country',
        countryCode: props.countrycode || '',
        lat,
        lng,
        formattedAddress
      };
    });
  } catch (error) {
    console.error('Error fetching geocoding from Photon:', error);
    return [];
  }
}
