export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      irrigation_alerts: {
        Row: {
          check_frequency: number | null
          created_at: string
          crop_coefficient: number | null
          et0_threshold: number | null
          id: string
          irrigation_duration: number | null
          irrigation_end_time: string | null
          irrigation_start_time: string | null
          is_active: boolean | null
          last_irrigation: string | null
          name: string
          notifications_enabled: boolean | null
          soil_moisture_critical: number | null
          soil_moisture_min: number | null
          temp_max: number | null
          temp_min: number | null
          temp_optimal_max: number | null
          temp_optimal_min: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          check_frequency?: number | null
          created_at?: string
          crop_coefficient?: number | null
          et0_threshold?: number | null
          id?: string
          irrigation_duration?: number | null
          irrigation_end_time?: string | null
          irrigation_start_time?: string | null
          is_active?: boolean | null
          last_irrigation?: string | null
          name: string
          notifications_enabled?: boolean | null
          soil_moisture_critical?: number | null
          soil_moisture_min?: number | null
          temp_max?: number | null
          temp_min?: number | null
          temp_optimal_max?: number | null
          temp_optimal_min?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          check_frequency?: number | null
          created_at?: string
          crop_coefficient?: number | null
          et0_threshold?: number | null
          id?: string
          irrigation_duration?: number | null
          irrigation_end_time?: string | null
          irrigation_start_time?: string | null
          is_active?: boolean | null
          last_irrigation?: string | null
          name?: string
          notifications_enabled?: boolean | null
          soil_moisture_critical?: number | null
          soil_moisture_min?: number | null
          temp_max?: number | null
          temp_min?: number | null
          temp_optimal_max?: number | null
          temp_optimal_min?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      irrigation_logs: {
        Row: {
          alert_id: string
          alert_type: string | null
          created_at: string
          et0_calculated: number | null
          humidity: number | null
          id: string
          irrigation_duration: number | null
          irrigation_triggered: boolean | null
          message: string | null
          soil_moisture: number | null
          solar_radiation: number | null
          temperature: number | null
          water_stress_index: number | null
          wind_speed: number | null
        }
        Insert: {
          alert_id: string
          alert_type?: string | null
          created_at?: string
          et0_calculated?: number | null
          humidity?: number | null
          id?: string
          irrigation_duration?: number | null
          irrigation_triggered?: boolean | null
          message?: string | null
          soil_moisture?: number | null
          solar_radiation?: number | null
          temperature?: number | null
          water_stress_index?: number | null
          wind_speed?: number | null
        }
        Update: {
          alert_id?: string
          alert_type?: string | null
          created_at?: string
          et0_calculated?: number | null
          humidity?: number | null
          id?: string
          irrigation_duration?: number | null
          irrigation_triggered?: boolean | null
          message?: string | null
          soil_moisture?: number | null
          solar_radiation?: number | null
          temperature?: number | null
          water_stress_index?: number | null
          wind_speed?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "irrigation_logs_alert_id_fkey"
            columns: ["alert_id"]
            isOneToOne: false
            referencedRelation: "irrigation_alerts"
            referencedColumns: ["id"]
          },
        ]
      }
      nutrient_schedules: {
        Row: {
          created_at: string | null
          ec_target: number | null
          frequency_days: number | null
          id: string
          nitrogen: number | null
          ph_target: number | null
          phase: string
          phosphorus: number | null
          plant_id: string
          potassium: number | null
        }
        Insert: {
          created_at?: string | null
          ec_target?: number | null
          frequency_days?: number | null
          id?: string
          nitrogen?: number | null
          ph_target?: number | null
          phase: string
          phosphorus?: number | null
          plant_id: string
          potassium?: number | null
        }
        Update: {
          created_at?: string | null
          ec_target?: number | null
          frequency_days?: number | null
          id?: string
          nitrogen?: number | null
          ph_target?: number | null
          phase?: string
          phosphorus?: number | null
          plant_id?: string
          potassium?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "nutrient_schedules_plant_id_fkey"
            columns: ["plant_id"]
            isOneToOne: false
            referencedRelation: "plants"
            referencedColumns: ["id"]
          },
        ]
      }
      plants: {
        Row: {
          created_at: string | null
          expected_harvest_days: number | null
          germination_date: string
          id: string
          is_active: boolean | null
          name: string
          notes: string | null
          strain_type: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          expected_harvest_days?: number | null
          germination_date: string
          id?: string
          is_active?: boolean | null
          name: string
          notes?: string | null
          strain_type?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          expected_harvest_days?: number | null
          germination_date?: string
          id?: string
          is_active?: boolean | null
          name?: string
          notes?: string | null
          strain_type?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      weather_alert_evaluations: {
        Row: {
          alerts: Json
          chat_id: string
          evaluated_at: string
          id: string
          status: string
          subscription_id: string
        }
        Insert: {
          alerts?: Json
          chat_id: string
          evaluated_at?: string
          id?: string
          status: string
          subscription_id: string
        }
        Update: {
          alerts?: Json
          chat_id?: string
          evaluated_at?: string
          id?: string
          status?: string
          subscription_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "weather_alert_evaluations_subscription_id_fkey"
            columns: ["subscription_id"]
            isOneToOne: false
            referencedRelation: "weather_alert_subscriptions"
            referencedColumns: ["id"]
          },
        ]
      }
      weather_alert_subscriptions: {
        Row: {
          chat_id: string
          created_at: string
          id: string
          is_active: boolean
          last_evaluated_at: string | null
          last_sent_at: Json | null
          last_status: string | null
          latitude: number
          location_name: string
          longitude: number
          owner_user_id: string | null
          thresholds: Json
          timezone: string
          updated_at: string
        }
        Insert: {
          chat_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_evaluated_at?: string | null
          last_sent_at?: Json | null
          last_status?: string | null
          latitude: number
          location_name: string
          longitude: number
          owner_user_id?: string | null
          thresholds: Json
          timezone?: string
          updated_at?: string
        }
        Update: {
          chat_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          last_evaluated_at?: string | null
          last_sent_at?: Json | null
          last_status?: string | null
          latitude?: number
          location_name?: string
          longitude?: number
          owner_user_id?: string | null
          thresholds?: Json
          timezone?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      owns_plant: {
        Args: { _plant_id: string; _user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
