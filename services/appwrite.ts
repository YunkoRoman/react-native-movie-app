import { Client, TablesDB, ID, Query } from "react-native-appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const TABLE_ID = process.env.EXPO_PUBLIC_APPWRITE_TABLE_ID!;

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const tables = new TablesDB(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
  try {
    const result = await tables.listRows(DATABASE_ID, TABLE_ID, [
      Query.equal("searchTerm", query),
    ]);

    console.log(result);

    if (result.rows.length > 0) {
      const existingMovie = result.rows[0];
      await tables.updateRow(
        DATABASE_ID,
        TABLE_ID,
        existingMovie.$id,
        {
          count: existingMovie.count + 1,
        }
      );
    } else {
        console.log(movie)
      await tables.createRow(DATABASE_ID, TABLE_ID, ID.unique(), {
        searchTerm: query,
        movie_id: movie.id,
        title: movie.title,
        count: 1,
        poster_url: `image.tmdb.org${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error("Error updating search count:", error);
    throw error;
  }
};

export const getTrendingMovies = async (): Promise<
  TrendingMovie[] | undefined
> => {
  try {
    const result = await tables.listRows(DATABASE_ID, TABLE_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);
    return result.rows as unknown as TrendingMovie[];
  } catch (error) {
    console.error(error);
    return undefined;
  }
};
