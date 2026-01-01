import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, ScrollView, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const { data: movies, loading: moviesLoading, error: moviesError, refetch } = useFetch(() => fetchMovies({ query: "" }));
  const { data: trendingMovies, loading: trendingMoviesLoading, error: trendingMoviesError } = useFetch(() => getTrendingMovies());

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg} className="w-full absolute"
      />
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{
        minHeight: "100%",
        paddingBottom: 10
      }}>
        <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
        {moviesLoading || trendingMoviesLoading ? <ActivityIndicator
          size="large"
          color="#0000ff"
          className="mt-10 self-center" /> :
          moviesError || trendingMoviesError ?
            <Text className="text-white text-center mt-10">Error: {moviesError?.message || trendingMoviesError?.message}</Text> :
            <View>
              <SearchBar onPress={() => router.push("/search")}
                placeholder='Search a movie'
                value={""}
                onChangeText={(text) => console.log(text)}
              />

              {trendingMovies && (
                <View className="mt-10">
                  <Text className="text-lg text-white font-bold mb-3">
                    Trending Movies
                  </Text>
                  <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="mb-4 mt-3"
                    data={trendingMovies}
                    contentContainerStyle={{
                      gap: 26,
                    }}
                    renderItem={({ item, index }) => (
                      <TrendingCard movie={item} index={index} />
                    )}
                    keyExtractor={(item) => item.movie_id.toString()}
                    ItemSeparatorComponent={() => <View className="w-4" />}
                  />
                </View>
              )}

              <>
                <Text className="text-lg text-white mt-5 font-bold mb-3">Latest Movies</Text>

                <FlatList
                  data={movies}
                  renderItem={({ item }) => <MovieCard {...item} />}
                  keyExtractor={(item) => item.id.toString()}
                  numColumns={3}
                  columnWrapperStyle={{
                    justifyContent: "flex-start",
                    gap: 20,
                    paddingRight: 5,
                    marginBottom: 10,
                  }}
                  className="mt-2 pb-32"
                  scrollEnabled={false}
                />
              </>
            </View>}
      </ScrollView>
    </View>
  );
}
