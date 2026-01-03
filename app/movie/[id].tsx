import { ActivityIndicator, ScrollView, Image, Text, View, TouchableOpacity, Linking } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/services/useFetch';
import { fetchMovieDetails } from '@/services/api';
import { icons } from '@/constants/icons';

const MovieHeader = ({ posterPath, homepage }: { posterPath?: string | null, homepage?: string | null }) => (
  <View className="relative">
    <Image
      source={{ uri: `https://image.tmdb.org/t/p/w500${posterPath}` }}
      className="w-full h-[550px]"
      resizeMode="stretch"
    />
    {homepage && (
      <TouchableOpacity
        onPress={() => homepage && Linking.openURL(homepage)}
        className="absolute -bottom-8 right-5 rounded-full size-16 bg-white flex items-center justify-center"
      >
        <Image source={icons.play} className="w-6 h-6 ml-1" resizeMode="stretch" />
      </TouchableOpacity>
    )}
  </View>
);

const MovieInfo = ({ movie }: { movie: any }) => (
  <View className="flex-col items-start justify-center mt-10 px-5">
    <Text className="text-white text-2xl font-bold">{movie?.title}</Text>
    <View className="mt-4 flex-row items-center">
      <Text className="text-light-200 text-sm">{movie?.release_date?.split("-")[0]} •</Text>
      <Text className="text-light-200 text-sm"> {movie?.runtime ? (movie.runtime >= 60 ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m` : `${movie.runtime}m`) : ''}</Text>
    </View>
    <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-4">
      <Image source={icons.star} className="size-4" />
      <Text className="text-white font-bold text-sm">{Math.round(movie?.vote_average ?? 0)}/10</Text>
      <Text className="text-light-200 text-sm">({movie?.vote_count} votes)</Text>
    </View>
  </View>
);

const MovieOverview = ({ overview }: { overview?: string | null }) => (
  <View className="mt-6 flex-col justify-between px-5">
    <Text className="text-light-200 text-sm">Overview</Text>
    <Text className="text-white text-lg mt-3">{overview}</Text>
  </View>
);

const MovieDetails = ({ releaseDate, status }: { releaseDate?: string | null, status?: string | null }) => (
  <View className="mt-6 flex-row gap-10 items-center px-5">
    <View>
      <Text className="text-light-200 text-sm font-bold">Release date</Text>
      <Text className="text-light-100 text-lg mt-3 font-semibold">
        {releaseDate ? new Date(releaseDate).toLocaleDateString("en-US", {
          year: "numeric", month: "long", day: "numeric"
        }) : "N/A"}
      </Text>
    </View>
    <View>
      <Text className="text-light-200 text-sm font-bold">Status</Text>
      <Text className="text-light-100 text-lg mt-3 font-semibold">{status || "N/A"}</Text>
    </View>
  </View>
);

const MovieGenres = ({ genres }: { genres?: { id: number, name: string }[] | null }) => (
  <View className="flex-col items-start gap-2 px-5 mt-6">
    <Text className="text-light-200 text-sm">Genres</Text>
    <View className="flex-row items-center gap-2">
      {genres?.map((genre) => (
        <View key={genre.id} className="flex-row items-center px-2 py-1 bg-dark-100 rounded-md">
          <Text className="text-white text-sm">{genre.name}</Text>
        </View>
      ))}
    </View>
  </View>
);

const MovieCountries = ({ countries }: { countries?: { name: string }[] | null }) => (
  <View className="flex-col items-start gap-2 px-5 mt-6">
    <Text className="text-light-200 text-sm">Countries</Text>
    <View className="flex-row items-center gap-2">
      {countries?.map((country) => (
        <Text key={country.name} className="text-light-100 text-lg font-semibold">{country.name}</Text>
      ))}
    </View>
  </View>
);

const MovieBudget = ({ budget, revenue }: { budget?: number | null, revenue?: number | null }) => {
  const formatCurrency = (value?: number | null) => {
    if (!value) return '$0';

    if (value >= 1_000_000_000) {
      return `$${(value / 1_000_000_000).toFixed(1)} billion`;
    } else if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)} million`;
    } else {
      return `$${value.toLocaleString()}`; // Shows full number with commas (e.g., $500,000)
    }
  };
  return (
    budget ? (
      <View className="flex-row items-start gap-10 px-5 mt-6">
        <View>
          <Text className="text-light-200 text-sm">Budget</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-light-100 text-lg font-semibold">
              {formatCurrency(budget)}
            </Text>
          </View>
        </View>

        <View>
          <Text className="text-light-200 text-sm">Revenue</Text>
          <View className="flex-row items-center gap-2">
            <Text className="text-light-100 text-lg font-semibold">
              {formatCurrency(revenue)}
            </Text>
          </View>
        </View>
      </View>
    ) : null
  )
};

const MovieProductionCompany = ({ productionCompanies }: { productionCompanies?: { id: number, name: string }[] | null }) => (
  <View className="flex-col items-start gap-2 px-5 mt-6">
    <Text className="text-light-200 text-sm">Production Companies</Text>
    <View className="flex flex-row flex-wrap items-center gap-2">
      <Text className="text-light-100 text-lg font-semibold">
        {productionCompanies?.map((company) => company.name).join("  •  ")}
      </Text>
    </View>
  </View>
);

const MovieScreen = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading, error } = useFetch(() => fetchMovieDetails(id as string));

  if (loading) return <SafeAreaView className="bg-primary flex-1"><ActivityIndicator /></SafeAreaView>;
  if (error) return <SafeAreaView className="bg-primary flex-1"><Text className='text-white text-2xl font-bold'>Error fetching movie details</Text></SafeAreaView>;

  return (
    <View className='flex-1 bg-primary'>
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <MovieHeader posterPath={movie?.poster_path} homepage={movie?.homepage} />
        <MovieInfo movie={movie} />
        <MovieOverview overview={movie?.overview} />
        <MovieDetails releaseDate={movie?.release_date} status={movie?.status} />
        <MovieGenres genres={movie?.genres} />
        <MovieCountries countries={movie?.production_countries} />
        <MovieBudget budget={movie?.budget} revenue={movie?.revenue} />
        <MovieProductionCompany productionCompanies={movie?.production_companies} />
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={() => router.back()}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieScreen;