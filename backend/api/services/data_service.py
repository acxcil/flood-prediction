import pandas as pd
import numpy as np
import os
import logging
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from api.core.config import settings
from api.core.errors import DataError

logger = logging.getLogger(__name__)

class DataService:
    def __init__(self):
        self.train_data = None
        self.validation_data = None
        self.test_data = None
        self.regions_info = None
        self._load_data()
        self._prepare_regions_info()
    
    def _load_data(self):
        """Load datasets from disk"""
        try:
            # Load training data
            if os.path.exists(settings.TRAIN_DATA_PATH):
                self.train_data = pd.read_csv(settings.TRAIN_DATA_PATH)
                logger.info(f"Loaded training data: {len(self.train_data)} records")
            
            # Load validation data
            if os.path.exists(settings.VALIDATION_DATA_PATH):
                self.validation_data = pd.read_csv(settings.VALIDATION_DATA_PATH)
                logger.info(f"Loaded validation data: {len(self.validation_data)} records")
            
            # Load test data
            if os.path.exists(settings.TEST_DATA_PATH):
                self.test_data = pd.read_csv(settings.TEST_DATA_PATH)
                logger.info(f"Loaded test data: {len(self.test_data)} records")
            
            if self.train_data is None and self.validation_data is None and self.test_data is None:
                raise DataError("No data files found")
            
        except Exception as e:
            logger.error(f"Error loading data: {e}")
            raise DataError(f"Failed to load data: {e}")
    
    def _prepare_regions_info(self):
        """Prepare information about regions from the data"""
        try:
            # Use the available data to extract regions
            data = self.train_data if self.train_data is not None else (
                self.validation_data if self.validation_data is not None else self.test_data
            )
            
            if data is None:
                raise DataError("No data available to extract regions")
            
            # Extract unique regions and their characteristics
            regions = data['region'].unique()
            
            # Prepare a dictionary of region information
            self.regions_info = {}
            
            for region in regions:
                region_data = data[data['region'] == region]
                basin = region_data['basin'].iloc[0] if 'basin' in region_data.columns else "Unknown"
                
                # Default coordinates - in a real system these would come from a proper source
                # Here we'll generate some random but plausible ones for Kyrgyzstan
                base_lat = 41.0 + np.random.uniform(-2, 2)  # Kyrgyzstan around 41°N
                base_lon = 74.0 + np.random.uniform(-6, 6)  # Kyrgyzstan around 74°E
                
                self.regions_info[region] = {
                    "id": region.lower().replace(' ', '_'),
                    "name": region,
                    "basin": basin,
                    "elevation_range": region_data['elevation_range'].iloc[0] if 'elevation_range' in region_data.columns else "medium",
                    "flood_threshold": region_data['flood_threshold'].iloc[0] if 'flood_threshold' in region_data.columns else 4.5,
                    "coordinates": {"lat": float(base_lat), "lon": float(base_lon)}
                }
            
            logger.info(f"Prepared information for {len(self.regions_info)} regions")
            
        except Exception as e:
            logger.error(f"Error preparing regions info: {e}")
            self.regions_info = {}
    
    def get_regions(self, sort_by: Optional[str] = None) -> List[Dict[str, Any]]:
        """Get all regions with their current status"""
        if not self.regions_info:
            raise DataError("No region information available")
        
        result = []
        for region_id, info in self.regions_info.items():
            # Simulate current river level as a percentage of flood threshold
            current_level = float(info["flood_threshold"] * np.random.uniform(0.5, 1.1))
            
            threshold = info["flood_threshold"]
            risk_ratio = current_level / threshold
            
            if risk_ratio >= 1.0:
                risk_level = "High"
            elif risk_ratio >= 0.8:
                risk_level = "Medium"
            else:
                risk_level = "Low"
                
            region_data = {
                "id": info["id"],
                "name": info["name"],
                "basin": info["basin"],
                "elevation_range": info["elevation_range"],
                "flood_threshold": float(threshold),
                "current_river_level": float(current_level),
                "risk_level": risk_level,
                "coordinates": info["coordinates"]
            }
            result.append(region_data)
        
        if sort_by:
            result = sorted(result, key=lambda x: x.get(sort_by))
        
        return result
    
    def get_region_by_id(self, region_id: str) -> Dict[str, Any]:
        """Get specific region by ID"""
        for rid, info in self.regions_info.items():
            if info["id"] == region_id:
                current_level = float(info["flood_threshold"] * np.random.uniform(0.5, 1.1))
                threshold = info["flood_threshold"]
                risk_ratio = current_level / threshold
                
                if risk_ratio >= 1.0:
                    risk_level = "High"
                elif risk_ratio >= 0.8:
                    risk_level = "Medium"
                else:
                    risk_level = "Low"
                
                return {
                    "id": info["id"],
                    "name": info["name"],
                    "basin": info["basin"],
                    "elevation_range": info["elevation_range"],
                    "flood_threshold": float(threshold),
                    "current_river_level": float(current_level),
                    "risk_level": risk_level,
                    "coordinates": info["coordinates"]
                }
        
        raise DataError(f"Region with id '{region_id}' not found", status_code=404)
    
    def get_historical_data(
        self, 
        region_id: Optional[str] = None, 
        days: int = 30, 
        start_dt: Optional[datetime] = None, 
        end_dt: Optional[datetime] = None
    ) -> List[Dict[str, Any]]:
        """Get historical data, optionally filtered by region and date range"""
        try:
            data = self.test_data if self.test_data is not None else (
                self.validation_data if self.validation_data is not None else self.train_data
            )
            
            if data is None:
                raise DataError("No data available")
            
            # Ensure date column is in datetime format
            if 'date' in data.columns and not pd.api.types.is_datetime64_dtype(data['date']):
                data['date'] = pd.to_datetime(data['date'])
            
            # Filter by region if specified
            if region_id:
                region_name = None
                for rid, info in self.regions_info.items():
                    if info["id"] == region_id:
                        region_name = info["name"]
                        break
                if not region_name:
                    raise DataError(f"Region with id '{region_id}' not found", status_code=404)
                
                data = data[data['region'] == region_name]
                if len(data) == 0:
                    raise DataError(f"No data available for region '{region_name}'")
            
            # Apply date range filtering if both start and end dates are provided
            if start_dt and end_dt:
                data = data[(data['date'] >= start_dt) & (data['date'] <= end_dt)]
            else:
                # Otherwise, sort by date descending and take the most recent entries
                data = data.sort_values(by='date', ascending=False).head(days)
            
            columns_to_include = ['date', 'region', 'river_level', 'precipitation', 'temperature', 'flood_status']
            columns_to_include = [col for col in columns_to_include if col in data.columns]
            
            result = data[columns_to_include].to_dict('records')
            for item in result:
                if 'date' in item and isinstance(item['date'], pd.Timestamp):
                    item['date'] = item['date'].strftime('%Y-%m-%d')
            return result
        
        except Exception as e:
            if isinstance(e, DataError):
                raise e
            logger.error(f"Error retrieving historical data: {e}")
            raise DataError(f"Failed to retrieve historical data: {str(e)}")
    
    def get_data_stats(self) -> Dict[str, Any]:
        """Get statistics about the available data"""
        try:
            data = self.train_data if self.train_data is not None else (
                self.validation_data if self.validation_data is not None else self.test_data
            )
            
            if data is None:
                raise DataError("No data available for statistics")
            
            stats = {
                "region_stats": {},
                "overall_stats": {
                    "total_records": len(data),
                    "flood_events": int(data['flood_status'].sum()) if 'flood_status' in data.columns else 0,
                    "non_flood_events": int(len(data) - data['flood_status'].sum()) if 'flood_status' in data.columns else 0,
                    "regions_count": len(data['region'].unique()) if 'region' in data.columns else 0
                },
                "time_series": {}
            }
            
            if 'region' in data.columns:
                for region in data['region'].unique():
                    region_data = data[data['region'] == region]
                    stats["region_stats"][region] = {
                        "records": len(region_data),
                        "flood_events": int(region_data['flood_status'].sum()) if 'flood_status' in region_data.columns else 0,
                        "avg_river_level": float(region_data['river_level'].mean()) if 'river_level' in region_data.columns else 0,
                        "max_river_level": float(region_data['river_level'].max()) if 'river_level' in region_data.columns else 0
                    }
            
            if 'date' in data.columns:
                try:
                    data['date'] = pd.to_datetime(data['date'])
                    monthly_data = data.groupby(data['date'].dt.month).agg({
                        'flood_status': ['count', 'sum']
                    })
                    stats["time_series"]["months"] = list(monthly_data.index)
                    stats["time_series"]["flood_counts"] = list(monthly_data[('flood_status', 'sum')])
                    stats["time_series"]["total_counts"] = list(monthly_data[('flood_status', 'count')])
                except Exception as e:
                    logger.warning(f"Error generating time series stats: {e}")
            
            return stats
        
        except Exception as e:
            if isinstance(e, DataError):
                raise e
            logger.error(f"Error calculating data statistics: {e}")
            raise DataError(f"Failed to calculate data statistics: {str(e)}")
    
    def get_data_as_dataframe(self, region_id: Optional[str] = None) -> pd.DataFrame:
        """Return data as a DataFrame for export purposes"""
        data = self.train_data if self.train_data is not None else (
            self.validation_data if self.validation_data is not None else self.test_data
        )
        if data is None:
            raise DataError("No data available for export")
        if region_id:
            data = data[data['region'] == region_id]
        return data

# Singleton instance to be used across the application
data_service = DataService()
