import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface CacheItem {
  data: any;
  timestamp: number;
  params?: string; // Stocke les paramètres de la requête sous forme de chaîne
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl+"/api.php";
  private cache: { [key: string]: CacheItem } = {};
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes en millisecondes

  constructor(private http: HttpClient) { }

  /**
   * Vérifie si les données en cache sont encore valides
   * @param cacheKey - Clé de cache à vérifier
   * @returns true si le cache est valide, false sinon
   */
  private isCacheValid(cacheKey: string): boolean {
    const cacheItem = this.cache[cacheKey];
    if (!cacheItem) return false;

    const now = Date.now();
    return (now - cacheItem.timestamp) < this.CACHE_DURATION;
  }

  /**
   * Génère une clé de cache unique pour une requête
   * @param table - Nom de la table
   * @param params - Paramètres de la requête
   * @returns Clé de cache unique
   */
  private generateCacheKey(table: string, params?: HttpParams): string {
    const paramsString = params ? params.toString() : '';
    return `${table}:${paramsString}`;
  }

  /**
   * Invalide le cache pour une table donnée
   * @param table - Nom de la table à invalider
   */
  private invalidateCache(table: string): void {
    Object.keys(this.cache).forEach(key => {
      if (key.startsWith(`${table}:`)) {
        delete this.cache[key];
      }
    });
  }

  /**
   * Crée un nouvel enregistrement
   * @param table - Nom de la table
   * @param data - Données à insérer
   */
  create(table: string, data: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/${table}`, data).pipe(
      tap(() => this.invalidateCache(table))
    );
  }

  /**
   * Récupère les enregistrements avec filtres optionnels
   * @param table - Nom de la table
   * @param filters - Filtres à appliquer (optionnel)
   * @param orderBy - Champ pour le tri (optionnel)
   */
  read(table: string, filters: any = {}, orderBy: string = ''): Observable<any> {
    let params = new HttpParams();
    
    // Ajout des filtres
    Object.keys(filters).forEach(key => {
      if (filters[key]) {
        params = params.set(key, filters[key]);
      }
    });

    // Ajout du tri
    if (orderBy) {
      params = params.set('orderBy', orderBy);
    }

    const cacheKey = this.generateCacheKey(table, params);

    // // Vérifier si les données sont en cache et valides
    // if (this.isCacheValid(cacheKey)) {
    //   console.log(`Using cached data for ${cacheKey}`);
    //   return of(this.cache[cacheKey].data);
    // }

    // Si pas en cache ou cache invalide, faire la requête
    return this.http.get(`${this.baseUrl}/${table}/`, { params }).pipe(
      tap(response => {
        // Mettre en cache les nouvelles données
        this.cache[cacheKey] = {
          data: response,
          timestamp: Date.now(),
          params: params.toString()
        };
        console.log(`Cached new data for ${cacheKey}`);
      })
    );
  }

  /**
   * Met à jour un enregistrement
   * @param table - Nom de la table
   * @param id - ID de l'enregistrement
   * @param data - Nouvelles données
   */
  update(table: string, id: number, data: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${table}/${id}`, data).pipe(
      tap(() => this.invalidateCache(table))
    );
  }

  /**
   * Supprime un enregistrement
   * @param table - Nom de la table
   * @param id - ID de l'enregistrement
   */
  delete(table: string, id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${table}/${id}`).pipe(
      tap(() => this.invalidateCache(table))
    );
  }

  /**
   * Récupère un enregistrement spécifique par son ID
   * @param table - Nom de la table
   * @param id - ID de l'enregistrement
   */
  getById(table: string, id: number): Observable<any> {
    return this.read(table, { id:id }).pipe(
      map((items: any[]) => {
        if (!items || items.length === 0) {
          throw new Error(`No ${table} found with id ${id}`);
        }
        return items[0];
      })
    );
  }
}
